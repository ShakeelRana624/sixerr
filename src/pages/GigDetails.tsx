import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_GIGS, MOCK_ORDERS, Order } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Star, Clock, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const gig = MOCK_GIGS.find(g => g.id === id);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('basic');

  if (!gig) {
    return <div className="container py-20 text-center">Gig not found</div>;
  }

  const currentPackage = gig.packages[selectedPackage];

  const handleContinue = () => {
    if (!user) {
      alert('Please login to continue');
      return;
    }

    // Simulate creating an order
    const newOrder: Order = {
      id: `o${Date.now()}`,
      gigId: gig.id,
      gigTitle: gig.title,
      gigImage: gig.image,
      clientId: user.id,
      clientName: user.name,
      freelancerId: gig.freelancerId,
      freelancerName: gig.freelancerName,
      packageType: currentPackage.name as 'Basic' | 'Standard' | 'Premium',
      price: currentPackage.price,
      platformFee: currentPackage.price * 0.2,
      sellerEarnings: currentPackage.price * 0.8,
      status: 'incomplete', // Starts as incomplete
      orderedAt: new Date().toISOString(),
      events: [{
        id: `e${Date.now()}`,
        type: 'system',
        senderId: 'system',
        senderName: 'System',
        content: 'Order placed. Waiting for requirements.',
        timestamp: new Date().toISOString()
      }]
    };

    // In a real app, this would be an API call. 
    // For now, we push to the mock array (which resets on reload, but works for the session)
    MOCK_ORDERS.unshift(newOrder);
    
    navigate('/orders');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
       <Link to="/gigs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <img 
                  src={gig.freelancerAvatar} 
                  alt={gig.freelancerName} 
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
                <span className="font-medium">{gig.freelancerName}</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold text-foreground">{gig.rating}</span>
                <span className="text-muted-foreground">({gig.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border">
            <img 
              src={gig.image} 
              alt={gig.title} 
              className="w-full object-cover max-h-[500px]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <h3 className="text-xl font-semibold mb-4">About This Gig</h3>
            <p className="text-muted-foreground leading-relaxed">{gig.description}</p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Compare Packages Table */}
          <div className="py-8">
            <h3 className="text-xl font-semibold mb-6">Compare Packages</h3>
            <div className="border rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-muted/30 divide-x">
                <div className="p-4 font-medium text-muted-foreground flex items-center">Package</div>
                <div className="p-4 font-bold text-center">Basic</div>
                <div className="p-4 font-bold text-center">Standard</div>
                <div className="p-4 font-bold text-center">Premium</div>
              </div>
              
              <div className="grid grid-cols-4 divide-x border-t">
                <div className="p-4 text-sm text-muted-foreground">Description</div>
                <div className="p-4 text-sm text-center">{gig.packages.basic.description}</div>
                <div className="p-4 text-sm text-center">{gig.packages.standard.description}</div>
                <div className="p-4 text-sm text-center">{gig.packages.premium.description}</div>
              </div>

              <div className="grid grid-cols-4 divide-x border-t bg-muted/10">
                <div className="p-4 text-sm text-muted-foreground">Delivery Time</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.basic.deliveryTime} Days</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.standard.deliveryTime} Days</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.premium.deliveryTime} Days</div>
              </div>

              <div className="grid grid-cols-4 divide-x border-t">
                <div className="p-4 text-sm text-muted-foreground">Revisions</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.basic.revisions === 0 ? 'Unlimited' : gig.packages.basic.revisions}</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.standard.revisions === 0 ? 'Unlimited' : gig.packages.standard.revisions}</div>
                <div className="p-4 text-sm text-center font-medium">{gig.packages.premium.revisions === 0 ? 'Unlimited' : gig.packages.premium.revisions}</div>
              </div>

              <div className="grid grid-cols-4 divide-x border-t bg-muted/10">
                <div className="p-4 text-sm text-muted-foreground">Price</div>
                <div className="p-4 text-lg font-bold text-center">${gig.packages.basic.price}</div>
                <div className="p-4 text-lg font-bold text-center">${gig.packages.standard.price}</div>
                <div className="p-4 text-lg font-bold text-center">${gig.packages.premium.price}</div>
              </div>
              
              <div className="grid grid-cols-4 divide-x border-t p-2">
                <div className="p-2"></div>
                <div className="p-2 text-center">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedPackage('basic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Select</Button>
                </div>
                <div className="p-2 text-center">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedPackage('standard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Select</Button>
                </div>
                <div className="p-2 text-center">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedPackage('premium'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Select</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-6">About The Seller</h3>
            <div className="flex gap-6">
              <img 
                src={gig.freelancerAvatar} 
                alt={gig.freelancerName} 
                className="w-24 h-24 rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2">
                <h4 className="font-bold text-lg">{gig.freelancerName}</h4>
                <p className="text-muted-foreground">Professional Freelancer</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Contact Me</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b">
              {(['basic', 'standard', 'premium'] as const).map((pkg) => (
                <button
                  key={pkg}
                  className={cn(
                    "flex-1 py-4 text-sm font-bold transition-colors border-b-2",
                    selectedPackage === pkg 
                      ? "border-primary text-primary bg-background" 
                      : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{currentPackage.name}</h3>
                <span className="text-2xl font-bold">${currentPackage.price}</span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                {currentPackage.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {currentPackage.deliveryTime} Days Delivery
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" /> {currentPackage.revisions === 0 ? 'Unlimited' : currentPackage.revisions} Revisions
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {currentPackage.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button className="w-full text-base py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" size="lg" onClick={handleContinue}>
                  Continue (${currentPackage.price})
                </Button>
                <Button variant="ghost" className="w-full mt-2">Contact Seller</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
