import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MOCK_GIGS } from '@/data/mockData';
import { UploadCloud } from 'lucide-react';

export const CreateGig: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priceBasic: '',
    priceStandard: '',
    pricePremium: '',
    deliveryTime: '',
    image: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const newGig = {
      id: `g${MOCK_GIGS.length + 1}`,
      freelancerId: user?.id || 'guest',
      freelancerName: user?.name || 'Guest User',
      freelancerAvatar: user?.avatar || 'https://picsum.photos/100',
      title: formData.title,
      description: formData.description,
      image: 'https://picsum.photos/seed/newgig/400/300', // Placeholder
      category: formData.category,
      rating: 0,
      reviewsCount: 0,
      startingPrice: Number(formData.priceBasic),
      deliveryTime: Number(formData.deliveryTime),
    };
    
    MOCK_GIGS.unshift(newGig);
    alert('Gig created successfully!');
    navigate('/gigs');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create a New Gig</h1>
        <p className="text-muted-foreground">Showcase your talent and start earning.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl border shadow-sm space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Gig Title</label>
              <div className="flex items-center border rounded-md bg-background px-3">
                <span className="text-muted-foreground mr-2 font-medium">I will</span>
                <input
                  id="title"
                  name="title"
                  required
                  className="flex-1 py-2 bg-transparent outline-none"
                  placeholder="do something I'm really good at"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
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
                <option value="Graphics & Design">Graphics & Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Writing & Translation">Writing & Translation</option>
                <option value="Video & Animation">Video & Animation</option>
                <option value="Music & Audio">Music & Audio</option>
                <option value="Programming & Tech">Programming & Tech</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="button" onClick={() => setStep(2)}>Next: Pricing</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pricing & Packages</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-center">Basic</h3>
                <input
                  name="priceBasic"
                  type="number"
                  placeholder="Price ($)"
                  className="w-full px-3 py-2 rounded-md border bg-background text-center"
                  value={formData.priceBasic}
                  onChange={handleChange}
                />
              </div>
              <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <h3 className="font-bold text-center">Standard</h3>
                <input
                  name="priceStandard"
                  type="number"
                  placeholder="Price ($)"
                  className="w-full px-3 py-2 rounded-md border bg-background text-center"
                  value={formData.priceStandard}
                  onChange={handleChange}
                />
              </div>
              <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
                <h3 className="font-bold text-center text-primary">Premium</h3>
                <input
                  name="pricePremium"
                  type="number"
                  placeholder="Price ($)"
                  className="w-full px-3 py-2 rounded-md border bg-background text-center"
                  value={formData.pricePremium}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="deliveryTime" className="text-sm font-medium">Delivery Time (Days)</label>
              <input
                id="deliveryTime"
                name="deliveryTime"
                type="number"
                required
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.deliveryTime}
                onChange={handleChange}
              />
            </div>
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={() => setStep(3)}>Next: Description</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Description & Gallery</h2>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                placeholder="Describe your gig in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Gig Image</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="gig-image"
                  onChange={handleFileChange}
                />
                <label htmlFor="gig-image" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                </label>
              </div>
            </div>
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" size="lg">Publish Gig</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
