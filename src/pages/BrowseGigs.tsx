import React, { useState, useEffect } from 'react';
import { MOCK_GIGS, Gig } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Star, Heart, Filter } from 'lucide-react';

export const BrowseGigs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gigs, setGigs] = useState<Gig[]>(MOCK_GIGS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(MOCK_GIGS.map(gig => gig.category)));

  useEffect(() => {
    let filtered = MOCK_GIGS;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(term) || 
        gig.description.toLowerCase().includes(term) ||
        gig.category.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(gig => gig.category === selectedCategory);
    }

    if (minPrice) {
      filtered = filtered.filter(gig => gig.startingPrice >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(gig => gig.startingPrice <= Number(maxPrice));
    }

    if (minRating > 0) {
      filtered = filtered.filter(gig => gig.rating >= minRating);
    }

    setGigs(filtered);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, minRating]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Gigs</h1>
          <p className="text-muted-foreground">Find services for your business.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`md:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-card border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-muted-foreground hover:text-primary">
                Clear all
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="all-categories" 
                      name="category" 
                      className="mr-2"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                    />
                    <label htmlFor="all-categories" className="text-sm">All Categories</label>
                  </div>
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input 
                        type="radio" 
                        id={category} 
                        name="category" 
                        className="mr-2"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={category} className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`rating-${rating}`} 
                        name="rating" 
                        className="mr-2"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                      />
                      <label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                        {rating}+ <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="rating-any" 
                      name="rating" 
                      className="mr-2"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                    />
                    <label htmlFor="rating-any" className="text-sm">Any Rating</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gigs Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={gig.image} 
                  alt={gig.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={gig.freelancerAvatar} 
                    alt={gig.freelancerName} 
                    className="w-6 h-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-medium truncate">{gig.freelancerName}</span>
                  <span className="text-xs text-muted-foreground ml-auto">Level 2</span>
                </div>

                <Link to={`/gigs/${gig.id}`} className="block font-medium hover:text-primary line-clamp-2 min-h-[3rem]">
                  {gig.title}
                </Link>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{gig.rating}</span>
                  <span className="text-muted-foreground">({gig.reviewsCount})</span>
                </div>
              </div>

              <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Heart className="mr-1 h-3 w-3" /> Save
                </Button>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Starting at</span>
                  <span className="block font-bold text-lg leading-none">${gig.startingPrice}</span>
                </div>
              </div>
            </div>
          ))}

          {gigs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-card border rounded-xl">
              <p className="text-muted-foreground">No gigs found matching your filters.</p>
              <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
