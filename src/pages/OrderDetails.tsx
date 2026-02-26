import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_ORDERS, MOCK_GIGS, Order, OrderEvent } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Send, Paperclip, FileText, Download, ShieldCheck, DollarSign } from 'lucide-react';
import { format, differenceInHours, differenceInDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<Record<string, string>>({});
  
  // Modals
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundOrder = MOCK_ORDERS.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.events]);

  if (!order || !user) {
    return <div className="container py-20 text-center">Order not found or access denied.</div>;
  }

  const isSeller = user.id === order.freelancerId;
  const isClient = user.id === order.clientId;

  if (!isSeller && !isClient) {
    return <div className="container py-20 text-center">You do not have permission to view this order.</div>;
  }

  // --- Logic Functions ---

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const newEvent: OrderEvent = {
      id: `e${Date.now()}`,
      type: 'message',
      senderId: user.id,
      senderName: user.name,
      content: message,
      files: file ? [URL.createObjectURL(file)] : undefined,
      timestamp: new Date().toISOString()
    };

    const updatedOrder = { ...order, events: [...order.events, newEvent] };
    setOrder(updatedOrder);
    // In real app, sync to backend
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index !== -1) MOCK_ORDERS[index] = updatedOrder;

    setMessage('');
    setFile(null);
  };

  const handleSubmitRequirements = () => {
    // Find the gig to get delivery time
    const gig = MOCK_GIGS.find(g => g.id === order.gigId);
    const deliveryDays = gig?.packages[order.packageType.toLowerCase() as 'basic'|'standard'|'premium']?.deliveryTime || 3;
    
    const deadline = addDays(new Date(), deliveryDays).toISOString();

    const updatedOrder: Order = {
      ...order,
      status: 'active',
      requirementsSubmittedAt: new Date().toISOString(),
      deadline: deadline,
      requirements: requirements,
      events: [
        ...order.events,
        {
          id: `e${Date.now()}`,
          type: 'system',
          senderId: 'system',
          senderName: 'System',
          content: 'Requirements submitted. The order has started!',
          timestamp: new Date().toISOString()
        }
      ]
    };
    setOrder(updatedOrder);
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index !== -1) MOCK_ORDERS[index] = updatedOrder;
  };

  const handleDeliverWork = () => {
    const updatedOrder: Order = {
      ...order,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      events: [
        ...order.events,
        {
          id: `e${Date.now()}`,
          type: 'delivery',
          senderId: user.id,
          senderName: user.name,
          content: deliveryMessage || 'Here is your delivery!',
          files: ['https://picsum.photos/seed/delivery/800/600'], // Mock file
          timestamp: new Date().toISOString()
        }
      ]
    };
    setOrder(updatedOrder);
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index !== -1) MOCK_ORDERS[index] = updatedOrder;
    setShowDeliveryModal(false);
  };

  const handleAcceptDelivery = () => {
    const updatedOrder: Order = {
      ...order,
      status: 'completed',
      completedAt: new Date().toISOString(),
      clearingDate: addDays(new Date(), 14).toISOString(), // 14 days clearing
      events: [
        ...order.events,
        {
          id: `e${Date.now()}`,
          type: 'system',
          senderId: 'system',
          senderName: 'System',
          content: 'Order completed! Funds are pending clearance.',
          timestamp: new Date().toISOString()
        }
      ]
    };
    setOrder(updatedOrder);
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index !== -1) MOCK_ORDERS[index] = updatedOrder;
  };

  const handleRequestRevision = () => {
    const updatedOrder: Order = {
      ...order,
      status: 'revision',
      events: [
        ...order.events,
        {
          id: `e${Date.now()}`,
          type: 'revision',
          senderId: user.id,
          senderName: user.name,
          content: 'Client requested a revision.',
          timestamp: new Date().toISOString()
        }
      ]
    };
    setOrder(updatedOrder);
    const index = MOCK_ORDERS.findIndex(o => o.id === order.id);
    if (index !== -1) MOCK_ORDERS[index] = updatedOrder;
  };

  // --- UI Components ---

  const StatusBadge = () => {
    const styles = {
      incomplete: 'bg-gray-100 text-gray-700',
      active: 'bg-blue-100 text-blue-700',
      delivered: 'bg-purple-100 text-purple-700',
      revision: 'bg-orange-100 text-orange-700',
      disputed: 'bg-red-100 text-red-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-200 text-gray-500',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[order.status]}`}>
        {order.status.replace('_', ' ')}
      </span>
    );
  };

  const Timer = () => {
    if (!order.deadline || order.status === 'completed' || order.status === 'cancelled' || order.status === 'incomplete') return null;
    
    const now = new Date();
    const deadline = new Date(order.deadline);
    const hoursLeft = differenceInHours(deadline, now);
    const daysLeft = differenceInDays(deadline, now);
    
    const isLate = now > deadline;

    return (
      <div className={`flex items-center gap-2 font-mono font-bold text-lg ${isLate ? 'text-red-600' : 'text-emerald-600'}`}>
        <Clock className="h-5 w-5" />
        {isLate ? 'LATE' : `${daysLeft}d ${hoursLeft % 24}h`}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <StatusBadge />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>{isClient ? `Seller: ${order.freelancerName}` : `Buyer: ${order.clientName}`}</span>
            <span>•</span>
            <span>{order.orderedAt && !isNaN(new Date(order.orderedAt).getTime()) ? format(new Date(order.orderedAt), 'MMM d, yyyy') : 'N/A'}</span>
            <span>•</span>
            <span className="font-bold text-foreground">${order.price}</span>
          </div>
        </div>
        <Timer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Chat & Activity) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gig Summary Card */}
          <div className="bg-card border rounded-xl p-4 flex gap-4 items-center shadow-sm">
            <img src={order.gigImage} alt="Gig" className="w-24 h-16 object-cover rounded-md" referrerPolicy="no-referrer" />
            <div>
              <h3 className="font-bold line-clamp-1">{order.gigTitle}</h3>
              <p className="text-sm text-muted-foreground">{order.packageType} Package</p>
            </div>
          </div>

          {/* Requirements Section (Only visible if incomplete) */}
          {order.status === 'incomplete' && isClient && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-blue-800">
                <AlertCircle className="h-6 w-6" />
                <h3 className="font-bold text-lg">Order Requirements</h3>
              </div>
              <p className="text-sm text-blue-700">The seller needs a few details to get started. The timer won't start until you submit these.</p>
              
              <div className="space-y-4 bg-white p-4 rounded-lg border">
                <label className="block text-sm font-medium mb-1">Please provide project details:</label>
                <textarea 
                  className="w-full p-3 border rounded-md" 
                  rows={4}
                  placeholder="Enter requirements here..."
                  onChange={(e) => setRequirements({ ...requirements, 'details': e.target.value })}
                />
                <Button onClick={handleSubmitRequirements} className="w-full">Start Order</Button>
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b bg-muted/30 font-medium flex justify-between items-center">
              <span>Activity</span>
              {order.status === 'active' && isSeller && (
                <Button variant="ghost" size="sm" className="text-xs">Request Extension</Button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {order.events.map((event) => (
                <div key={event.id} className={`flex flex-col ${event.senderId === user.id ? 'items-end' : 'items-start'}`}>
                  
                  {/* System Message */}
                  {event.type === 'system' && (
                    <div className="w-full flex justify-center my-4">
                      <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                        {event.content} • {event.timestamp && !isNaN(new Date(event.timestamp).getTime()) ? format(new Date(event.timestamp), 'h:mm a') : ''}
                      </span>
                    </div>
                  )}

                  {/* Delivery Message */}
                  {event.type === 'delivery' && (
                    <div className="w-full max-w-2xl mx-auto bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-4">
                      <div className="flex items-center gap-3 mb-4 text-emerald-800">
                        <CheckCircle className="h-6 w-6" />
                        <h3 className="font-bold text-lg">Delivery Submitted</h3>
                      </div>
                      <p className="text-emerald-900 mb-4 whitespace-pre-wrap">{event.content}</p>
                      {event.files?.map((f, i) => (
                        <div key={i} className="bg-white p-3 rounded border flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-medium flex-1">Delivery_File_{i+1}.jpg</span>
                          <Button size="sm" variant="outline" className="h-8">Download</Button>
                        </div>
                      ))}
                      <div className="text-xs text-emerald-600 mt-2 text-right">
                        {event.timestamp && !isNaN(new Date(event.timestamp).getTime()) ? format(new Date(event.timestamp), 'MMM d, h:mm a') : ''}
                      </div>
                    </div>
                  )}

                  {/* Chat Message */}
                  {event.type === 'message' && (
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      event.senderId === user.id 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold opacity-80">{event.senderName}</span>
                        <span className="text-[10px] opacity-60">{event.timestamp && !isNaN(new Date(event.timestamp).getTime()) ? format(new Date(event.timestamp), 'h:mm a') : ''}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{event.content}</p>
                      {event.files && (
                        <div className="mt-2 pt-2 border-t border-white/20">
                          <div className="flex items-center gap-2 text-xs">
                            <Paperclip className="h-3 w-3" />
                            <span>Attachment</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <input 
                    className="flex-1 bg-muted/50 border-0 rounded-md px-4 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Card */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Order Actions</h3>
            
            {/* Seller Actions */}
            {isSeller && (
              <div className="space-y-3">
                {order.status === 'active' || order.status === 'revision' ? (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" onClick={() => setShowDeliveryModal(true)}>
                    Deliver Now
                  </Button>
                ) : null}
                
                {order.status === 'delivered' && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Waiting for client review.</p>
                  </div>
                )}
              </div>
            )}

            {/* Client Actions */}
            {isClient && (
              <div className="space-y-3">
                {order.status === 'delivered' && (
                  <>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" onClick={handleAcceptDelivery}>
                      Accept & Complete Order
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleRequestRevision}>
                      Request Revision
                    </Button>
                  </>
                )}
                {order.status === 'active' && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Seller is working on your order.</p>
                  </div>
                )}
              </div>
            )}
            
            {order.status === 'completed' && (
              <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg border border-green-100">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-bold">Order Completed</p>
                <p className="text-xs mt-1">Funds are clearing.</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-card border rounded-xl p-6 shadow-sm text-sm space-y-4">
            <h3 className="font-bold border-b pb-2">Order Details</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>3 Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">#{order.id}</span>
            </div>
            {isSeller && (
              <div className="pt-4 border-t space-y-2">
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Price</span>
                  <span>${order.price}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Service Fee (20%)</span>
                  <span>-${order.platformFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Earnings</span>
                  <span className="text-emerald-600">${order.sellerEarnings}</span>
                </div>
              </div>
            )}
          </div>

          {/* Support */}
          <div className="bg-muted/20 border rounded-xl p-6 text-center space-y-2">
            <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground" />
            <h4 className="font-bold">Resolution Center</h4>
            <p className="text-xs text-muted-foreground">Having issues with the order?</p>
            <Button variant="link" className="text-primary h-auto p-0">Visit Resolution Center</Button>
          </div>

        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Deliver Completed Work</h2>
            <div className="space-y-4">
              <textarea 
                className="w-full p-3 border rounded-md min-h-[150px]"
                placeholder="Describe your delivery..."
                value={deliveryMessage}
                onChange={(e) => setDeliveryMessage(e.target.value)}
              />
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/10">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Work Files</p>
                <p className="text-xs text-muted-foreground">Max 1GB</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowDeliveryModal(false)}>Cancel</Button>
                <Button onClick={handleDeliverWork} className="bg-emerald-600 hover:bg-emerald-700">Deliver Work</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
