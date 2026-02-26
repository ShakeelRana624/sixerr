import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Search, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, login, logout, switchRole, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', role: 'all' },
    { name: 'Find Work', path: '/jobs', role: 'freelancer' },
    { name: 'My Proposals', path: '/my-proposals', role: 'freelancer' },
    { name: 'My Jobs', path: '/dashboard', role: 'freelancer' },
    { name: 'Orders', path: '/orders', role: 'all' },
    { name: 'Find Talent', path: '/gigs', role: 'client' },
    { name: 'Post a Job', path: '/post-job', role: 'client' },
    { name: 'Messages', path: '/messages', role: 'all' },
  ];

  const filteredLinks = navLinks.filter(link => 
    link.role === 'all' || (user && link.role === user.role) || (!user && link.role === 'client')
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <span className="font-mono text-lg">6</span>
          </div>
          <span>Sixerr</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {filteredLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && user && !user.isSeller && (
            <Link to="/become-seller" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Become a Seller
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full border border-border"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b mb-2">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email || 'user@example.com'}</p>
                  </div>
                  
                  <Link 
                    to={`/profile/${user.id}`} 
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                  
                  <button 
                    onClick={switchRole}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <Briefcase className="mr-2 h-4 w-4" /> Switch to {user.role === 'client' ? 'Freelancer' : 'Client'}
                  </button>
                  
                  <div className="border-t my-2"></div>
                  
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => login('freelancer')}>Join as Freelancer</Button>
              <Button onClick={() => login('client')}>Join as Client</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {filteredLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-sm font-medium py-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <img 
                      src={user?.avatar} 
                      alt={user?.name} 
                      className="h-8 w-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start" onClick={switchRole}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Switch to {user?.role === 'client' ? 'Freelancer' : 'Client'}
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={() => { login('freelancer'); setIsMenuOpen(false); }}>Join as Freelancer</Button>
                  <Button onClick={() => { login('client'); setIsMenuOpen(false); }}>Join as Client</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
