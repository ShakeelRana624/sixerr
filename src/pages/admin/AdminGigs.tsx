import React, { useState } from 'react';
import { MOCK_GIGS, Gig } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
  const [filter, setFilter] = useState<'all' | 'pending_approval' | 'active'>('pending_approval');

  const filteredGigs = filter === 'all' 
    ? gigs 
    : gigs.filter(g => g.status === filter);

  const handleApprove = (id: string) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: 'active' } : g));
    // In real app, API call here
  };

  const handleReject = (id: string) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: 'draft' } : g)); // Or deleted
    // In real app, API call here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gig Management</h1>
          <p className="text-muted-foreground">Review and moderate gigs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'pending_approval' ? 'default' : 'outline'} onClick={() => setFilter('pending_approval')}>Pending</Button>
          <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')}>Active</Button>
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Gig</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredGigs.map((gig) => (
              <tr key={gig.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={gig.image} alt="" className="w-12 h-8 object-cover rounded" referrerPolicy="no-referrer" />
                    <span className="font-medium line-clamp-1 max-w-[200px]" title={gig.title}>{gig.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{gig.freelancerName}</td>
                <td className="px-6 py-4">{gig.category}</td>
                <td className="px-6 py-4">${gig.startingPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    gig.status === 'active' ? 'bg-green-100 text-green-700' :
                    gig.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {gig.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="View Gig">
                      <Link to={`/gigs/${gig.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {gig.status === 'pending_approval' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(gig.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(gig.id)}>
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredGigs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No gigs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
