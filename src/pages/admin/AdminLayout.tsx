import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, DollarSign, AlertTriangle, Settings, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Sixerr Admin</h1>
          <p className="text-xs text-muted-foreground">Control Room</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Users className="h-5 w-5" />
            User Management
          </NavLink>
          
          <NavLink 
            to="/admin/gigs" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Briefcase className="h-5 w-5" />
            Gigs & Jobs
          </NavLink>
          
          <NavLink 
            to="/admin/financials" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <DollarSign className="h-5 w-5" />
            Financials
          </NavLink>
          
          <NavLink 
            to="/admin/disputes" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <AlertTriangle className="h-5 w-5" />
            Disputes
          </NavLink>
          
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
