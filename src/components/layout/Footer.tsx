import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <span className="font-mono text-lg">6</span>
              </div>
              <span>Sixerr</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The hybrid marketplace for modern work. Combining the best of bidding and gigs.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/gigs" className="hover:text-primary">Find Talent</Link></li>
              <li><Link to="/post-job" className="hover:text-primary">Post a Job</Link></li>
              <li><Link to="/enterprise" className="hover:text-primary">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/jobs" className="hover:text-primary">Find Work</Link></li>
              <li><Link to="/create-gig" className="hover:text-primary">Create a Gig</Link></li>
              <li><Link to="/community" className="hover:text-primary">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/support" className="hover:text-primary">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sixerr Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
