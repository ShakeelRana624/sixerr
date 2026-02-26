import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_JOBS, MOCK_GIGS } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, Star, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
        <Button asChild><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground block">Balance</span>
            <span className="text-xl font-bold text-primary">${user.balance.toFixed(2)}</span>
          </div>
          {user.role === 'freelancer' && (
            <div className="bg-secondary/50 px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground block">Connects</span>
              <span className="text-xl font-bold">{user.connects}</span>
            </div>
          )}
        </div>
      </div>

      {user.role === 'freelancer' && <FreelancerDashboard />}
      {user.role === 'client' && <ClientDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

const FreelancerDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Jobs" value="3" icon={<Briefcase className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Earnings this Month" value="$1,250" icon={<TrendingUp className="h-5 w-5 text-green-500" />} />
        <StatCard title="Profile Views" value="45" icon={<Users className="h-5 w-5 text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Jobs */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Active Jobs</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold">E-commerce Website Development</h3>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">In Progress</span>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-2 px-0">View All Jobs</Button>
        </div>

        {/* My Gigs */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Gigs</h2>
            <Button size="sm" asChild><Link to="/create-gig">Create New</Link></Button>
          </div>
          <div className="space-y-4">
            {MOCK_GIGS.slice(0, 2).map((gig) => (
              <div key={gig.id} className="flex gap-4 items-center p-3 border rounded-lg">
                <img src={gig.image} alt={gig.title} className="w-16 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{gig.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {gig.rating}</span>
                    <span>•</span>
                    <span>{gig.reviewsCount} Sales</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Postings" value="2" icon={<Briefcase className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Total Spent" value="$5,400" icon={<DollarSign className="h-5 w-5 text-green-500" />} />
        <StatCard title="Hires" value="12" icon={<Users className="h-5 w-5 text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Job Postings */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Job Postings</h2>
            <Button size="sm" asChild><Link to="/post-job">Post New Job</Link></Button>
          </div>
          <div className="space-y-4">
            {MOCK_JOBS.slice(0, 3).map((job) => (
              <div key={job.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{job.title}</h3>
                  <span className="text-sm font-bold">${job.budget}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{job.proposalsCount} Proposals</span>
                  <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Active Contracts</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">JD</div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Mobile App UI Design</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Message</Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-3 text-yellow-800">
        <AlertCircle className="h-5 w-5" />
        <p>There are 3 new disputes requiring your attention.</p>
        <Button variant="outline" size="sm" className="ml-auto border-yellow-300 hover:bg-yellow-100 text-yellow-900">View Disputes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,234" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Revenue" value="$45,678" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Active Jobs" value="156" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="New Gigs" value="89" icon={<Star className="h-5 w-5" />} />
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm">User <strong>Alice</strong> posted a new job <strong>React Developer needed</strong></p>
              </div>
              <span className="text-xs text-muted-foreground">2 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-card border rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="p-2 bg-muted rounded-full">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
