import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MOCK_JOBS } from '@/data/mockData';

export const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    skills: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    const newJob = {
      id: `j${MOCK_JOBS.length + 1}`,
      clientId: user?.id || 'guest',
      title: formData.title,
      description: formData.description,
      budget: Number(formData.budget),
      deadline: formData.deadline,
      category: formData.category,
      skills: formData.skills.split(',').map(s => s.trim()),
      proposalsCount: 0,
      postedAt: new Date().toISOString(),
    };
    
    // Simulating adding to mock data (won't persist across reloads in this setup but good for demo)
    MOCK_JOBS.unshift(newJob);
    
    alert('Job posted successfully!');
    navigate('/jobs');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post a Job</h1>
        <p className="text-muted-foreground">Tell us about your project and get proposals from top talent.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Job Title</label>
          <input
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="e.g. Build a React Native App"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Writing">Writing</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            className="w-full px-3 py-2 rounded-md border bg-background resize-none"
            placeholder="Describe your project in detail..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">Budget ($)</label>
            <input
              id="budget"
              name="budget"
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="500"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="skills" className="text-sm font-medium">Required Skills (comma separated)</label>
          <input
            id="skills"
            name="skills"
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="React, Node.js, TypeScript"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" size="lg">Post Job Now</Button>
        </div>
      </form>
    </div>
  );
};
