import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, Briefcase, MessageSquare } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
                The Hybrid Marketplace for <span className="text-primary">Modern Work</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Combine the flexibility of bidding on projects with the speed of buying pre-packaged gigs. Sixerr brings the best of both worlds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/jobs">
                    Find Work <Briefcase className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/gigs">
                    Hire Talent <Search className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Verified Freelancers</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Secure Escrow</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto lg:ml-auto w-full max-w-[500px] aspect-square bg-background rounded-2xl shadow-2xl border p-6 flex flex-col gap-6"
            >
              {/* Mock UI Elements representing Hybrid nature */}
              <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Post a Job (Bidding)</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Upwork Style</span>
                </div>
                <div className="h-2 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-muted rounded"></div>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Buy a Gig (Direct)</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Fiverr Style</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-muted rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-full bg-muted rounded"></div>
                    <div className="h-2 w-2/3 bg-muted rounded"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">6</div>
                  <div>
                    <p className="text-sm font-bold">Hybrid Model</p>
                    <p className="text-xs text-muted-foreground">Best of both worlds</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose Sixerr?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've taken the best features from the leading platforms and combined them into one seamless experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Flexible Hiring",
                description: "Post a job for custom projects or buy a gig for quick tasks. You choose how you want to work.",
                icon: <Briefcase className="h-8 w-8 text-primary" />
              },
              {
                title: "Secure Payments",
                description: "Funds are held in escrow until you're satisfied with the work. Release payment only when the job is done.",
                icon: <CheckCircle2 className="h-8 w-8 text-primary" />
              },
              {
                title: "Direct Communication",
                description: "Chat directly with freelancers before and during the project. Share files and get updates in real-time.",
                icon: <MessageSquare className="h-8 w-8 text-primary" />
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4 bg-primary/10 w-fit p-3 rounded-xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
