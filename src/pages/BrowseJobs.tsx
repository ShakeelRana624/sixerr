import React, { useState, useEffect } from 'react';
import { MOCK_JOBS, Job } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const BrowseJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(MOCK_JOBS.map(job => job.category)));

  useEffect(() => {
    let filtered = MOCK_JOBS;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.description.toLowerCase().includes(term) ||
        job.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (minBudget) {
      filtered = filtered.filter(job => job.budget >= Number(minBudget));
    }

    if (maxBudget) {
      filtered = filtered.filter(job => job.budget <= Number(maxBudget));
    }

    setJobs(filtered);
  }, [searchTerm, selectedCategory, minBudget, maxBudget]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinBudget('');
    setMaxBudget('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">Find the perfect project for your skills.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`md:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-card border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-muted-foreground hover:text-primary">
                Clear all
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="all-categories" 
                      name="category" 
                      className="mr-2"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                    />
                    <label htmlFor="all-categories" className="text-sm">All Categories</label>
                  </div>
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input 
                        type="radio" 
                        id={category} 
                        name="category" 
                        className="mr-2"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={category} className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Budget</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="md:col-span-3 grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link to={`/jobs/${job.id}`} className="text-xl font-semibold hover:text-primary hover:underline">
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {formatDistanceToNow(new Date(job.postedAt))} ago</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Remote</span>
                    <span>Proposals: {job.proposalsCount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg block">${job.budget}</span>
                  <span className="text-xs text-muted-foreground">Fixed Price</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px]">
                        ?
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">+2 others applied</span>
                </div>
                <Button asChild>
                  <Link to={`/jobs/${job.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
          
          {jobs.length === 0 && (
            <div className="text-center py-12 bg-card border rounded-xl">
              <p className="text-muted-foreground">No jobs found matching your filters.</p>
              <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
