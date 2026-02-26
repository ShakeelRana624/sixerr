import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_JOBS, MOCK_PROPOSALS, Proposal } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Flag, Share2, ArrowLeft, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, updateUser } = useAuth();
  const job = MOCK_JOBS.find(j => j.id === id);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS.filter(p => p.jobId === id));
  
  const [proposalText, setProposalText] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [duration, setDuration] = useState('1 to 3 months');
  const [hasApplied, setHasApplied] = useState(false);

  if (!job) {
    return <div className="container py-20 text-center">Job not found</div>;
  }

  const isOwner = user?.id === job.clientId;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user.connects >= 2) {
      const newProposal: Proposal = {
        id: `p${Date.now()}`,
        jobId: job.id,
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerAvatar: user.avatar || '',
        coverLetter: proposalText,
        bidAmount: Number(bidAmount),
        duration: duration,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      
      // In a real app, this would be an API call
      setProposals([...proposals, newProposal]);
      updateUser({ connects: user.connects - 2 });
      setHasApplied(true);
      alert('Proposal submitted successfully! 2 Connects deducted.');
    } else {
      alert('Insufficient connects!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                <Clock className="h-4 w-4" /> Posted {formatDistanceToNow(new Date(job.postedAt))} ago
              </span>
              <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                <MapPin className="h-4 w-4" /> Worldwide
              </span>
              <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                <DollarSign className="h-4 w-4" /> Fixed Price
              </span>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <h3 className="text-xl font-semibold mb-2">Job Description</h3>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Client View: Received Proposals */}
          {isOwner && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Received Proposals ({proposals.length})</h2>
              {proposals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-card border rounded-xl">
                  No proposals yet.
                </div>
              ) : (
                proposals.map(proposal => (
                  <div key={proposal.id} className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={proposal.freelancerAvatar} 
                          alt={proposal.freelancerName} 
                          className="w-12 h-12 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{proposal.freelancerName}</h3>
                          <p className="text-sm text-muted-foreground">Freelancer</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xl block">${proposal.bidAmount}</span>
                        <span className="text-xs text-muted-foreground">Bid Price</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg mb-4">
                      <p className="text-sm italic">"{proposal.coverLetter}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Duration: <span className="font-medium text-foreground">{proposal.duration}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" /> Message
                        </Button>
                        <Button size="sm">Hire Now</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Freelancer View: Submit Proposal */}
          {user?.role === 'freelancer' && !isOwner && !hasApplied && (
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Submit a Proposal</h2>
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bid Amount ($)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-3 py-2 rounded-md border bg-background"
                      placeholder={job.budget.toString()}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Sixerr Service Fee: 20%</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <select 
                      className="w-full px-3 py-2 rounded-md border bg-background"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option>Less than 1 month</option>
                      <option>1 to 3 months</option>
                      <option>3 to 6 months</option>
                      <option>More than 6 months</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                    placeholder="Explain why you are the best fit for this job..."
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">Requires 2 Connects</span>
                  <Button type="submit" size="lg">Submit Proposal</Button>
                </div>
              </form>
            </div>
          )}

          {hasApplied && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800">Proposal Submitted!</h3>
              <p className="text-green-600">Good luck! The client will contact you if you're shortlisted.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">About the Client</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  C
                </div>
                <div>
                  <p className="font-medium">Client Name</p>
                  <p className="text-xs text-muted-foreground">Member since 2021</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">$12.5k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">United States</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => alert('Job saved!')}>
                <Heart className="mr-2 h-4 w-4" /> Save Job
              </Button>
              <Button variant="ghost" className="w-full">
                <Flag className="mr-2 h-4 w-4" /> Report Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for icons
const Heart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
