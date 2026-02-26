import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, UserProfile } from '@/data/mockData';

export type UserRole = 'client' | 'freelancer' | 'admin';

// User now extends UserProfile directly, no need for separate interface if they match
export interface User extends UserProfile {
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: () => void;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addToPortfolio: (item: { id: string; image: string; title: string }) => void;
  becomeSeller: (sellerData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock login function
  const login = (role: UserRole) => {
    // Use Alice (u5) as the default logged-in user for demo purposes
    // If role is admin, use the admin user
    let mockProfile = MOCK_USERS.find(u => u.id === 'u5'); 
    
    if (role === 'admin') {
      mockProfile = MOCK_USERS.find(u => u.id === 'admin1');
    }

    if (!mockProfile) return; // Should not happen with mock data
    
    const mockUser: User = {
      ...mockProfile,
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem('sixerr_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sixerr_user');
  };

  const switchRole = () => {
    if (user) {
      const newRole = user.role === 'client' ? 'freelancer' : 'client';
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('sixerr_user', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('sixerr_user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('sixerr_user', JSON.stringify(updatedUser));
      
      // Also update the MOCK_USERS array in memory so other components see it
      const index = MOCK_USERS.findIndex(u => u.id === user.id);
      if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...updates };
      }
    }
  };

  const addToPortfolio = (item: { id: string; image: string; title: string }) => {
    if (user) {
      const currentPortfolio = user.portfolio || [];
      const updatedPortfolio = [...currentPortfolio, item];
      updateProfile({ portfolio: updatedPortfolio });
    }
  };

  const becomeSeller = (sellerData: Partial<UserProfile>) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        ...sellerData,
        isSeller: true,
        role: 'freelancer', // Automatically switch to freelancer view
        status: 'active' // In a real app, this might be 'pending_approval'
      };
      setUser(updatedUser);
      localStorage.setItem('sixerr_user', JSON.stringify(updatedUser));
      
      // Update mock data
      const index = MOCK_USERS.findIndex(u => u.id === user.id);
      if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...sellerData, isSeller: true, status: 'active' };
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('sixerr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, updateUser, updateProfile, addToPortfolio, becomeSeller, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
