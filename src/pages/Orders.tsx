import React, { useState } from 'react';
import { MOCK_ORDERS, Order } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  // In a real app, filter by user.id. For mock, we show all or filter if user is set.
  // For demo purposes, let's assume the logged in user is involved in these orders.
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'completed' | 'cancelled'>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <div className="flex gap-2">
          {(['all', 'active', 'delivered', 'completed', 'cancelled'] as const).map((status) => (
            <Button 
              key={status} 
              variant={filter === status ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs border font-medium uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-muted-foreground">Order #{order.id}</span>
                  <span className="text-sm text-muted-foreground">• {format(new Date(order.orderedAt), 'MMM d, yyyy')}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">
                  <Link to={`/gigs/${order.gigId}`} className="hover:text-primary hover:underline">
                    {order.packageType} Package - Gig Service
                  </Link>
                </h3>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">Client:</span> {order.clientName}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">Freelancer:</span> {order.freelancerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 
                    {order.deadline ? (
                      <>Due {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}</>
                    ) : (
                      <span>No deadline set</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-4 min-w-[150px]">
                <div className="text-right">
                  <span className="font-bold text-2xl block">${order.price}</span>
                </div>

                <div className="flex gap-2">
                  {/* Freelancer Actions */}
                  {user?.role === 'freelancer' && order.status === 'active' && (
                    <Button size="sm" onClick={() => handleStatusChange(order.id, 'delivered')}>
                      <Package className="mr-2 h-4 w-4" /> Deliver Work
                    </Button>
                  )}

                  {/* Client Actions */}
                  {user?.role === 'client' && order.status === 'delivered' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(order.id, 'completed')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Accept & Complete
                    </Button>
                  )}
                  
                  {user?.role === 'client' && order.status === 'active' && (
                     <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                       Cancel Order
                     </Button>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/messages`}>Message</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-card border rounded-xl">
            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">There are no orders with this status.</p>
          </div>
        )}
      </div>
    </div>
  );
};
