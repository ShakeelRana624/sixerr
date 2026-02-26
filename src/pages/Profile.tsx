import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_USERS, UserProfile } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, MessageSquare, CheckCircle2, Edit2, Plus, X, Save, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, updateProfile, addToPortfolio } = useAuth();
  
  // Determine if we are viewing the logged-in user's profile
  const isOwnProfile = user?.id === id;
  
  // Use user data from context if it's own profile, otherwise find in mock data
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isOwnProfile && user) {
      setProfile(user);
    } else {
      const foundUser = MOCK_USERS.find(u => u.id === id);
      setProfile(foundUser || MOCK_USERS[0]);
    }
  }, [id, user, isOwnProfile]);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [newSkill, setNewSkill] = useState('');

  // Add Portfolio State
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', image: '' });

  if (!profile) {
    return <div className="container py-20 text-center">User not found</div>;
  }

  const handleEditClick = () => {
    setEditForm({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      location: profile.location,
      hourlyRate: profile.hourlyRate,
      skills: profile.skills ? [...profile.skills] : [],
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (isOwnProfile) {
      updateProfile(editForm);
      setIsEditing(false);
    }
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    const skillToAdd = newSkill.trim();
    if (skillToAdd && editForm.skills && !editForm.skills.includes(skillToAdd)) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillToAdd] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (editForm.skills) {
      setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skillToRemove) });
    }
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwnProfile && newPortfolioItem.title && newPortfolioItem.image) {
      addToPortfolio({
        id: `pf${Date.now()}`,
        title: newPortfolioItem.title,
        image: newPortfolioItem.image,
      });
      setIsAddingPortfolio(false);
      setNewPortfolioItem({ title: '', image: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm text-center relative group">
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleEditClick}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}

            <div className="relative inline-block mb-4">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-32 h-32 rounded-full mx-auto border-4 border-background shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
            <p className="text-muted-foreground mb-4">{profile.title}</p>
            
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-6">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-bold text-lg text-foreground">{profile.rating}</span>
              <span className="text-muted-foreground text-sm">({profile.reviewsCount} reviews)</span>
            </div>

            <div className="space-y-3">
              <Button className="w-full">Contact Me</Button>
              <Button variant="outline" className="w-full">Get a Quote</Button>
            </div>

            <div className="mt-8 pt-8 border-t text-left space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> From
                </span>
                <span className="font-medium">{profile.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Member Since
                </span>
                <span className="font-medium">
                  {profile.joinedAt && !isNaN(new Date(profile.joinedAt).getTime()) 
                    ? format(new Date(profile.joinedAt), 'MMM yyyy') 
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Hourly Rate
                </span>
                <span className="font-medium">${profile.hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm relative group">
             {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleEditClick}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <h3 className="font-bold text-lg mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border rounded-xl p-8 shadow-sm relative group">
             {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleEditClick}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>

          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Portfolio</h2>
              {isOwnProfile && (
                <Button size="sm" variant="outline" onClick={() => setIsAddingPortfolio(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.portfolio?.map(item => (
                <div key={item.id} className="group relative aspect-video rounded-lg overflow-hidden border bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                </div>
              ))}
              {(!profile.portfolio || profile.portfolio.length === 0) && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No portfolio items yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Reviews</h2>
            <div className="space-y-6">
              {profile.reviews?.map(review => (
                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {review.reviewerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{review.reviewerName}</h4>
                        <div className="flex items-center gap-1 text-yellow-500 text-xs">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Professional Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({...editForm, hourlyRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border bg-background resize-none"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 rounded-md border bg-background"
                    placeholder="Add a skill (e.g. React)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={() => handleAddSkill()}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.skills?.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {isAddingPortfolio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Add Portfolio Item</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsAddingPortfolio(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleAddPortfolio}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    placeholder="e.g. E-commerce Website"
                    value={newPortfolioItem.title}
                    onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      required
                      className="w-full px-3 py-2 rounded-md border bg-background"
                      placeholder="https://example.com/image.jpg"
                      value={newPortfolioItem.image}
                      onChange={(e) => setNewPortfolioItem({...newPortfolioItem, image: e.target.value})}
                    />
                    <Button type="button" variant="outline" size="icon" title="Use Random Image" onClick={() => setNewPortfolioItem({...newPortfolioItem, image: `https://picsum.photos/seed/${Date.now()}/400/300`})}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Tip: Use the upload button to generate a random placeholder.</p>
                </div>
                {newPortfolioItem.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border aspect-video">
                    <img src={newPortfolioItem.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
              <div className="p-6 border-t flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingPortfolio(false)}>Cancel</Button>
                <Button type="submit">Add to Portfolio</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
