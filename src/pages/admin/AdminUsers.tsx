import React, { useState } from 'react';
import { MOCK_USERS, UserProfile } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Shield, Ban, CheckCircle, MoreVertical, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const { login } = useAuth(); // For impersonation
  const navigate = useNavigate();

  const handleVerify = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isIdentityVerified: true } : u));
  };

  const handleSuspend = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
  };

  const handleImpersonate = (user: UserProfile) => {
    // In a real app, this would be a secure token exchange
    // For mock, we just use the login function with a special flow or just set user
    // Since our login function takes a role, we can't fully simulate impersonation easily without changing auth context
    // But for now, let's just alert
    alert(`Impersonating ${user.username}... (Feature pending backend implementation)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage users, verification, and permissions.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.isAdmin ? <span className="font-bold text-purple-600">Admin</span> : (user.isSeller ? 'Seller' : 'Buyer')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isIdentityVerified ? (
                    <span className="flex items-center text-green-600 gap-1">
                      <Shield className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4">{new Date(user.joinedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!user.isIdentityVerified && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleVerify(user.id)}>
                        Verify
                      </Button>
                    )}
                    {user.status === 'active' && !user.isAdmin && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleSuspend(user.id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    {!user.isAdmin && (
                         <Button size="sm" variant="ghost" onClick={() => handleImpersonate(user)} title="Impersonate">
                            <LogIn className="h-4 w-4" />
                         </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
