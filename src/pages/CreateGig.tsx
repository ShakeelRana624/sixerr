import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MOCK_GIGS, Gig, GigPackage, GigFAQ, GigRequirement } from '@/data/mockData';
import { UploadCloud, CheckCircle, Plus, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Overview' },
  { id: 2, title: 'Pricing' },
  { id: 3, title: 'Description & FAQ' },
  { id: 4, title: 'Requirements' },
  { id: 5, title: 'Gallery' },
  { id: 6, title: 'Publish' },
];

export const CreateGig: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  
  // Initial State
  const [formData, setFormData] = useState<Partial<Gig>>({
    title: '',
    category: '',
    tags: [],
    metadata: {},
    packages: {
      basic: { name: 'Basic', description: '', price: 10, deliveryTime: 1, revisions: 1, features: [] },
      standard: { name: 'Standard', description: '', price: 25, deliveryTime: 3, revisions: 3, features: [] },
      premium: { name: 'Premium', description: '', price: 50, deliveryTime: 5, revisions: 0, features: [] },
    },
    description: '',
    faqs: [],
    requirements: [],
    gallery: [],
  });

  // Helper to update nested state
  const updateFormData = (updates: Partial<Gig>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updatePackage = (pkgType: 'basic' | 'standard' | 'premium', field: keyof GigPackage, value: any) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages!,
        [pkgType]: {
          ...prev.packages![pkgType],
          [field]: value
        }
      }
    }));
  };

  const handlePublish = () => {
    // Validation could go here
    
    const newGig: Gig = {
      id: `g${MOCK_GIGS.length + 1}`,
      freelancerId: user?.id || 'guest',
      freelancerName: user?.name || 'Guest User',
      freelancerAvatar: user?.avatar || 'https://picsum.photos/100',
      title: formData.title || '',
      description: formData.description || '',
      image: formData.gallery?.[0] || 'https://picsum.photos/seed/newgig/400/300',
      category: formData.category || 'Other',
      tags: formData.tags || [],
      metadata: formData.metadata,
      rating: 0,
      reviewsCount: 0,
      startingPrice: formData.packages?.basic.price || 5,
      deliveryTime: formData.packages?.basic.deliveryTime || 1,
      packages: formData.packages as any,
      faqs: formData.faqs || [],
      requirements: formData.requirements || [],
      gallery: formData.gallery || [],
      status: 'pending_approval', // Admin Review Feature
    };
    
    MOCK_GIGS.unshift(newGig);
    alert('Gig submitted for Admin Review! It will be live after approval.');
    navigate('/gigs');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Step Navigation */}
        <div className="bg-background border rounded-xl p-4 mb-8 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                  step >= s.id 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-background border-muted-foreground text-muted-foreground"
                )}>
                  {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  step >= s.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.title}
                </span>
                {s.id < 6 && <div className="w-8 h-px bg-border mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            
            {/* Step 1: Overview */}
            {step === 1 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Overview</h2>
                  <p className="text-muted-foreground">The first impression of your gig.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gig Title</label>
                    <div className="flex items-center border rounded-md bg-background px-3 focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="text-muted-foreground mr-2 font-medium">I will</span>
                      <input
                        className="flex-1 py-3 bg-transparent outline-none text-lg"
                        placeholder="do something I'm really good at"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{formData.title?.length || 0}/80 max</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full px-3 py-3 rounded-md border bg-background"
                      value={formData.category}
                      onChange={(e) => updateFormData({ category: e.target.value })}
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Tags</label>
                    <input
                      className="w-full px-3 py-3 rounded-md border bg-background"
                      placeholder="Enter tags separated by commas (e.g. logo, design, minimal)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !formData.tags?.includes(val) && (formData.tags?.length || 0) < 5) {
                            updateFormData({ tags: [...(formData.tags || []), val] });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2">
                          #{tag}
                          <button 
                            onClick={() => updateFormData({ tags: formData.tags?.filter(t => t !== tag) })}
                            className="hover:text-red-500"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">5 tags maximum.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Scope & Pricing</h2>
                  <p className="text-muted-foreground">Define your packages.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="p-4 border bg-muted/30 w-1/4 text-left">Package</th>
                        <th className="p-4 border bg-muted/10 w-1/4">Basic</th>
                        <th className="p-4 border bg-muted/10 w-1/4">Standard</th>
                        <th className="p-4 border bg-muted/10 w-1/4">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 border font-medium">Name</td>
                        {(['basic', 'standard', 'premium'] as const).map(pkg => (
                          <td key={pkg} className="p-2 border">
                            <input 
                              className="w-full p-2 border rounded text-center"
                              value={formData.packages?.[pkg].name}
                              onChange={(e) => updatePackage(pkg, 'name', e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 border font-medium">Description</td>
                        {(['basic', 'standard', 'premium'] as const).map(pkg => (
                          <td key={pkg} className="p-2 border">
                            <textarea 
                              className="w-full p-2 border rounded resize-none text-sm"
                              rows={4}
                              placeholder="Describe what you offer..."
                              value={formData.packages?.[pkg].description}
                              onChange={(e) => updatePackage(pkg, 'description', e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 border font-medium">Delivery Time</td>
                        {(['basic', 'standard', 'premium'] as const).map(pkg => (
                          <td key={pkg} className="p-2 border">
                            <select 
                              className="w-full p-2 border rounded"
                              value={formData.packages?.[pkg].deliveryTime}
                              onChange={(e) => updatePackage(pkg, 'deliveryTime', Number(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5, 7, 10, 14, 21, 30].map(d => (
                                <option key={d} value={d}>{d} Days</option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 border font-medium">Revisions</td>
                        {(['basic', 'standard', 'premium'] as const).map(pkg => (
                          <td key={pkg} className="p-2 border">
                            <select 
                              className="w-full p-2 border rounded"
                              value={formData.packages?.[pkg].revisions}
                              onChange={(e) => updatePackage(pkg, 'revisions', Number(e.target.value))}
                            >
                              <option value={0}>Unlimited</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 border font-medium">Price ($)</td>
                        {(['basic', 'standard', 'premium'] as const).map(pkg => (
                          <td key={pkg} className="p-2 border">
                            <input 
                              type="number"
                              className="w-full p-2 border rounded text-center font-bold"
                              min={5}
                              step={5}
                              value={formData.packages?.[pkg].price}
                              onChange={(e) => updatePackage(pkg, 'price', Number(e.target.value))}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 3: Description & FAQ */}
            {step === 3 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Description & FAQ</h2>
                  <p className="text-muted-foreground">Describe your gig in detail.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gig Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-md border bg-background min-h-[300px]"
                    placeholder="Briefly describe your gig..."
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min. 120 characters</span>
                    <span>{formData.description?.length || 0}/1200</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Frequently Asked Questions</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateFormData({ faqs: [...(formData.faqs || []), { question: '', answer: '' }] })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add FAQ
                    </Button>
                  </div>
                  
                  {formData.faqs?.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/10">
                      <input 
                        className="w-full px-3 py-2 rounded-md border bg-background font-medium"
                        placeholder="Add a Question: i.e. Do you translate to English as well?"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...(formData.faqs || [])];
                          newFaqs[index].question = e.target.value;
                          updateFormData({ faqs: newFaqs });
                        }}
                      />
                      <textarea 
                        className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                        rows={2}
                        placeholder="Add an Answer: i.e. Yes, I also translate from English to Spanish."
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...(formData.faqs || [])];
                          newFaqs[index].answer = e.target.value;
                          updateFormData({ faqs: newFaqs });
                        }}
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => updateFormData({ faqs: formData.faqs?.filter((_, i) => i !== index) })}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Requirements */}
            {step === 4 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Requirements</h2>
                  <p className="text-muted-foreground">Tell your client what you need to get started.</p>
                </div>

                <div className="space-y-4">
                   <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => updateFormData({ requirements: [...(formData.requirements || []), { question: '', type: 'text', required: true }] })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Requirement
                    </Button>

                    {formData.requirements?.map((req, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/10">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase text-muted-foreground">Requirement #{index + 1}</label>
                          <textarea 
                            className="w-full px-3 py-2 rounded-md border bg-background"
                            rows={2}
                            placeholder="What do you need from the buyer?"
                            value={req.question}
                            onChange={(e) => {
                              const newReqs = [...(formData.requirements || [])];
                              newReqs[index].question = e.target.value;
                              updateFormData({ requirements: newReqs });
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <select 
                              className="px-3 py-2 rounded-md border bg-background text-sm"
                              value={req.type}
                              onChange={(e) => {
                                const newReqs = [...(formData.requirements || [])];
                                newReqs[index].type = e.target.value as any;
                                updateFormData({ requirements: newReqs });
                              }}
                            >
                              <option value="text">Free Text</option>
                              <option value="multiple_choice">Multiple Choice</option>
                              <option value="attachment">Attachment</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={req.required}
                                onChange={(e) => {
                                  const newReqs = [...(formData.requirements || [])];
                                  newReqs[index].required = e.target.checked;
                                  updateFormData({ requirements: newReqs });
                                }}
                              />
                              Required Answer
                            </label>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => updateFormData({ requirements: formData.requirements?.filter((_, i) => i !== index) })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 5: Gallery */}
            {step === 5 && (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Gallery</h2>
                  <p className="text-muted-foreground">Showcase your best work.</p>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer bg-muted/10">
                    <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Drag & Drop Photos</h3>
                    <p className="text-muted-foreground text-sm mb-6">Upload photos that describe or are related to your gig.</p>
                    <Button variant="outline">Browse Files</Button>
                    <p className="text-xs text-muted-foreground mt-4">Max 3 images. (1280x769 px recommended)</p>
                  </div>

                  {/* Simulated Uploaded Images */}
                  <div className="grid grid-cols-3 gap-4">
                    {formData.gallery?.map((img, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => updateFormData({ gallery: formData.gallery?.filter((_, i) => i !== index) })}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {/* Placeholder to simulate adding images for demo */}
                    <div 
                      className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50"
                      onClick={() => updateFormData({ gallery: [...(formData.gallery || []), `https://picsum.photos/seed/${Date.now()}/400/300`] })}
                    >
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="sr-only">Add Mock Image</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Publish */}
            {step === 6 && (
              <div className="space-y-8 max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Almost There!</h2>
                  <p className="text-muted-foreground">Let's publish your Gig and get you ready to sell.</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-left flex gap-4">
                  <AlertCircle className="h-6 w-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Admin Review Required</h4>
                    <p className="text-sm text-blue-800">
                      To ensure quality, all new gigs are reviewed by our team. This usually takes 24 hours. Your gig will be marked as "Pending Approval" until then.
                    </p>
                  </div>
                </div>

                <div className="text-left space-y-4 border rounded-lg p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm">
                      I declare that these materials were created by myself or by my team and do not infringe on any 3rd party rights. I understand that the illegal use of digital assets is against Sixerr's Terms of Service and may result in blocking my account.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" required />
                    <span className="text-sm">
                      I confirm that I have read and agree to the Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div>

                <Button size="lg" className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700" onClick={handlePublish}>
                  Submit for Review
                </Button>
              </div>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="bg-muted/50 p-6 border-t flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setStep(prev => prev - 1)} 
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              Back
            </Button>
            
            {step < 6 && (
              <Button onClick={() => setStep(prev => prev + 1)}>
                Save & Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
