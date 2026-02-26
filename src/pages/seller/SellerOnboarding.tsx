import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component, otherwise standard input
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component
import { CheckCircle, ChevronRight, ChevronLeft, Upload, Globe, Lock, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/data/mockData';

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Tell us a bit about yourself' },
  { id: 2, title: 'Professional Info', description: 'Your skills and experience' },
  { id: 3, title: 'Linked Accounts', description: 'Build trust with clients' },
  { id: 4, title: 'Account Security', description: 'Secure your account' },
];

export const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, becomeSeller } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user?.name || '',
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    languages: user?.languages || [{ language: 'English', level: 'Basic' }],
    occupation: user?.occupation || '',
    skills: user?.skills || [],
    education: user?.education || [],
    certifications: user?.certifications || [],
    personalWebsite: user?.personalWebsite || '',
    linkedAccounts: user?.linkedAccounts || {},
  });

  // Helper for text inputs
  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Final submission
    becomeSeller(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10"></div>
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-background p-2 rounded-lg z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-muted border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="h-6 w-6" /> : step.id}
                </div>
                <span className={`text-xs font-medium mt-2 ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">{STEPS[currentStep - 1].title}</h2>
            <p className="text-muted-foreground mb-8">{STEPS[currentStep - 1].description}</p>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-md border bg-background"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Your real name (private).</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-md border bg-background"
                      placeholder="JohnD"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Visible to clients.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Picture <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">Upload Photo</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={5}
                    className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                    placeholder="Share a bit about your work experience, cool projects you've completed, and your area of expertise."
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min. 150 characters</span>
                    <span>{formData.bio?.length || 0}/600</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Languages <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 rounded-md border bg-background"
                      placeholder="Language (e.g. English)"
                      value={formData.languages?.[0]?.language}
                      onChange={(e) => {
                        const newLangs = [...(formData.languages || [])];
                        if (!newLangs[0]) newLangs[0] = { language: '', level: 'Basic' };
                        newLangs[0].language = e.target.value;
                        handleChange('languages', newLangs);
                      }}
                    />
                    <select 
                      className="w-40 px-3 py-2 rounded-md border bg-background"
                      value={formData.languages?.[0]?.level}
                      onChange={(e) => {
                        const newLangs = [...(formData.languages || [])];
                        if (!newLangs[0]) newLangs[0] = { language: '', level: 'Basic' };
                        newLangs[0].level = e.target.value as any;
                        handleChange('languages', newLangs);
                      }}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native/Bilingual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Occupation <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                  >
                    <option value="">Select Occupation</option>
                    <option value="Graphics & Design">Graphics & Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Writing & Translation">Writing & Translation</option>
                    <option value="Programming & Tech">Programming & Tech</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 rounded-md border bg-background"
                      placeholder="Add Skill (e.g. Voice Over)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !formData.skills?.includes(val)) {
                            handleChange('skills', [...(formData.skills || []), val]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button 
                          onClick={() => handleChange('skills', formData.skills?.filter(s => s !== skill))}
                          className="hover:text-red-500"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="url" 
                      className="w-full pl-9 px-3 py-2 rounded-md border bg-background"
                      placeholder="https://yourportfolio.com"
                      value={formData.personalWebsite}
                      onChange={(e) => handleChange('personalWebsite', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Private link (optional).</p>
                </div>
              </div>
            )}

            {/* Step 3: Linked Accounts */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Taking the time to verify and link your accounts can upgrade your credibility and help provide us with more details.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">G</div>
                      <span className="font-medium">Google</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleChange('linkedAccounts', { ...formData.linkedAccounts, google: true })}>
                      {formData.linkedAccounts?.google ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">F</div>
                      <span className="font-medium">Facebook</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleChange('linkedAccounts', { ...formData.linkedAccounts, facebook: true })}>
                      {formData.linkedAccounts?.facebook ? 'Connected' : 'Connect'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold">GH</div>
                      <span className="font-medium">GitHub</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleChange('linkedAccounts', { ...formData.linkedAccounts, github: true })}>
                      {formData.linkedAccounts?.github ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Account Security */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50/50 border-green-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Email Verified</h4>
                    <p className="text-sm text-green-700">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Phone Number Verification <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <input 
                      type="tel" 
                      className="flex-1 px-3 py-2 rounded-md border bg-background"
                      placeholder="+1 234 567 8900"
                    />
                    <Button variant="outline">Send Code</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll send you an SMS with a code to verify your number.</p>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <Lock className="h-4 w-4" />
                  Your phone number will remain private.
                </div>
              </div>
            )}

          </div>
          
          <div className="bg-muted/50 p-6 border-t flex justify-between">
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'invisible' : ''}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {currentStep === 4 ? 'Finish & Create Seller Profile' : 'Continue'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
