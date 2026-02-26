/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { BrowseJobs } from '@/pages/BrowseJobs';
import { PostJob } from '@/pages/PostJob';
import { BrowseGigs } from '@/pages/BrowseGigs';
import { CreateGig } from '@/pages/CreateGig';
import { JobDetails } from '@/pages/JobDetails';
import { GigDetails } from '@/pages/GigDetails';
import { Messages } from '@/pages/Messages';
import { Dashboard } from '@/pages/Dashboard';

import { MyProposals } from '@/pages/MyProposals';

import { Orders } from '@/pages/Orders';

import { Profile } from '@/pages/Profile';
import { SellerOnboarding } from '@/pages/seller/SellerOnboarding';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/my-proposals" element={<MyProposals />} />
              <Route path="/gigs" element={<BrowseGigs />} />
              <Route path="/gigs/:id" element={<GigDetails />} />
              <Route path="/create-gig" element={<CreateGig />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/become-seller" element={<SellerOnboarding />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
