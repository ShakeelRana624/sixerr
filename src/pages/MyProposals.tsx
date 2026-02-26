import React from 'react';
import { MOCK_PROPOSALS, MOCK_JOBS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const MyProposals: React.FC = () => {
  // In a real app, we would filter by the logged-in user's ID
  // For this mock, we'll just show all mock proposals as if they belong to the user "u5" (Alice)
  // or just show all of them for demonstration
  const proposals = MOCK_PROPOSALS; 

  const getJobDetails = (jobId: string) => {
    return MOCK_JOBS.find(j => j.id === jobId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'bg-green-100 text-green-700 border-green-200';
      case 'shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Proposals</h1>

      <div className="space-y-6">
        {proposals.map((proposal) => {
          const job = getJobDetails(proposal.jobId);
          if (!job) return null;

          return (
            <div key={proposal.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold hover:text-primary">
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Submitted {formatDistanceToNow(new Date(proposal.submittedAt))} ago
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(proposal.status)} capitalize`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg block">${proposal.bidAmount}</span>
                  <span className="text-xs text-muted-foreground">Bid Price</span>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground line-clamp-2">{proposal.coverLetter}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Client Budget: </span>
                  <span className="font-medium">${job.budget}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/jobs/${job.id}`}>View Job</Link>
                </Button>
              </div>
            </div>
          );
        })}

        {proposals.length === 0 && (
          <div className="text-center py-12 bg-card border rounded-xl">
            <p className="text-muted-foreground mb-4">You haven't submitted any proposals yet.</p>
            <Button asChild>
              <Link to="/jobs">Find Work</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
