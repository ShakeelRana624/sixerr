import { User } from '@/context/AuthContext';

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  skills: string[];
  proposalsCount: number;
  postedAt: string;
}

export interface GigPackage {
  name: string;
  description: string;
  price: number;
  deliveryTime: number; // in days
  revisions: number; // 0 for unlimited
  features: string[];
}

export interface GigFAQ {
  question: string;
  answer: string;
}

export interface GigRequirement {
  question: string;
  type: 'text' | 'multiple_choice' | 'attachment';
  options?: string[]; // for multiple_choice
  required: boolean;
}

export interface Gig {
  id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  title: string;
  description: string;
  image: string; // Main image
  category: string;
  tags: string[]; // Search tags
  metadata?: Record<string, string>; // e.g., { style: '3D', format: 'PNG' }
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  deliveryTime: number; // kept for backward compatibility or display
  packages: {
    basic: GigPackage;
    standard: GigPackage;
    premium: GigPackage;
  };
  faqs: GigFAQ[];
  requirements: GigRequirement[];
  gallery: string[]; // Array of image URLs
  status: 'active' | 'paused' | 'pending_approval' | 'draft';
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  coverLetter: string;
  bidAmount: number;
  duration: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  submittedAt: string;
}

export type OrderStatus = 'incomplete' | 'active' | 'delivered' | 'revision' | 'disputed' | 'completed' | 'cancelled';

export interface OrderEvent {
  id: string;
  type: 'message' | 'system' | 'delivery' | 'revision' | 'extension_request';
  senderId: string;
  senderName: string;
  content: string;
  files?: string[];
  timestamp: string;
  meta?: any;
}

export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  gigImage: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  packageType: 'Basic' | 'Standard' | 'Premium';
  price: number;
  platformFee: number; // 20%
  sellerEarnings: number; // 80%
  status: OrderStatus;
  orderedAt: string;
  requirementsSubmittedAt?: string;
  deadline?: string;
  deliveredAt?: string;
  completedAt?: string;
  clearingDate?: string;
  events: OrderEvent[];
  requirements?: Record<string, string>;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    gigId: 'g1',
    gigTitle: 'I will design a professional logo for your business',
    gigImage: 'https://picsum.photos/seed/g1/400/300',
    clientId: 'u2',
    clientName: 'Jane Doe',
    freelancerId: 'u5',
    freelancerName: 'Alice Smith',
    packageType: 'Standard',
    price: 120,
    platformFee: 24,
    sellerEarnings: 96,
    status: 'active',
    orderedAt: '2023-10-25T10:00:00Z',
    requirementsSubmittedAt: '2023-10-25T11:00:00Z',
    deadline: '2023-10-30T11:00:00Z',
    events: [
      {
        id: 'e1',
        type: 'system',
        senderId: 'system',
        senderName: 'System',
        content: 'Order started. Requirements submitted.',
        timestamp: '2023-10-25T11:00:00Z'
      },
      {
        id: 'e2',
        type: 'message',
        senderId: 'u2',
        senderName: 'Jane Doe',
        content: 'Hi Alice, really looking forward to this!',
        timestamp: '2023-10-25T11:05:00Z'
      }
    ]
  },
  {
    id: 'o2',
    gigId: 'g2',
    gigTitle: 'I will write SEO optimized blog posts',
    gigImage: 'https://picsum.photos/seed/g2/400/300',
    clientId: 'u2',
    clientName: 'Jane Doe',
    freelancerId: 'u6',
    freelancerName: 'Bob Jones',
    packageType: 'Basic',
    price: 30,
    platformFee: 6,
    sellerEarnings: 24,
    status: 'completed',
    orderedAt: '2023-10-20T09:00:00Z',
    requirementsSubmittedAt: '2023-10-20T09:30:00Z',
    deadline: '2023-10-22T09:30:00Z',
    deliveredAt: '2023-10-21T15:00:00Z',
    completedAt: '2023-10-22T10:00:00Z',
    clearingDate: '2023-11-05T10:00:00Z',
    events: [
      {
        id: 'e1',
        type: 'system',
        senderId: 'system',
        senderName: 'System',
        content: 'Order completed.',
        timestamp: '2023-10-22T10:00:00Z'
      }
    ]
  },
  {
    id: 'o3',
    gigId: 'g3',
    gigTitle: 'I will build a responsive WordPress website',
    gigImage: 'https://picsum.photos/seed/g3/400/300',
    clientId: 'u5', // Alice buying from Charlie
    clientName: 'Alice Smith',
    freelancerId: 'u7',
    freelancerName: 'Charlie Brown',
    packageType: 'Premium',
    price: 600,
    platformFee: 120,
    sellerEarnings: 480,
    status: 'incomplete',
    orderedAt: '2023-10-27T14:00:00Z',
    events: [
      {
        id: 'e1',
        type: 'system',
        senderId: 'system',
        senderName: 'System',
        content: 'Order placed. Waiting for requirements.',
        timestamp: '2023-10-27T14:00:00Z'
      }
    ]
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    jobId: 'j1',
    freelancerId: 'u5',
    freelancerName: 'Alice Smith',
    freelancerAvatar: 'https://picsum.photos/seed/u5/100/100',
    coverLetter: 'I have extensive experience with React Native and have built similar apps. I can deliver this in 2 months.',
    bidAmount: 2800,
    duration: '1 to 3 months',
    status: 'pending',
    submittedAt: '2023-10-26T11:00:00Z',
  },
  {
    id: 'p2',
    jobId: 'j1',
    freelancerId: 'u6',
    freelancerName: 'Bob Jones',
    freelancerAvatar: 'https://picsum.photos/seed/u6/100/100',
    coverLetter: 'I am a full stack developer and can handle both frontend and backend for this project.',
    bidAmount: 3000,
    duration: '1 to 3 months',
    status: 'shortlisted',
    submittedAt: '2023-10-26T12:30:00Z',
  }
];

export interface Education {
  country: string;
  university: string;
  title: string;
  major: string;
  year: string;
}

export interface Certification {
  name: string;
  from: string;
  year: string;
}

export interface LinkedAccounts {
  google?: boolean;
  facebook?: boolean;
  twitter?: boolean;
  github?: boolean;
  dribbble?: boolean;
}

export interface UserProfile {
  id: string;
  username: string; // Unique identifier
  email: string;
  name: string; // Full Name (Private)
  displayName: string; // Public Display Name
  avatar: string;
  title: string;
  location: string;
  bio: string; // Description
  skills: string[];
  skillLevels?: Record<string, 'Beginner' | 'Intermediate' | 'Expert'>;
  languages: { language: string; level: 'Basic' | 'Conversational' | 'Fluent' | 'Native' }[];
  occupation?: string;
  education?: Education[];
  certifications?: Certification[];
  personalWebsite?: string;
  linkedAccounts?: LinkedAccounts;
  
  // Status flags
  isSeller: boolean;
  isAdmin?: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  status: 'active' | 'suspended' | 'pending_approval';
  
  // Stats
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  joinedAt: string;
  balance: number;
  connects: number;
  
  reviews: Review[];
  portfolio: { id: string; image: string; title: string }[];
}

export interface Dispute {
  id: string;
  orderId: string;
  initiatorId: string;
  initiatorName: string;
  respondentId: string;
  respondentName: string;
  reason: string;
  description: string;
  status: 'open' | 'resolved' | 'closed';
  createdAt: string;
  resolution?: 'refund_buyer' | 'pay_seller' | 'split';
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'earning' | 'fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  referenceId?: string; // Order ID or Gig ID
}

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    orderId: 'o1',
    initiatorId: 'u2',
    initiatorName: 'Jane Doe',
    respondentId: 'u5',
    respondentName: 'Alice Smith',
    reason: 'Quality of work',
    description: 'The logo delivered does not match the requirements provided.',
    status: 'open',
    createdAt: '2023-10-28T10:00:00Z'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    userId: 'u5',
    userName: 'Alice Smith',
    type: 'earning',
    amount: 96,
    status: 'pending',
    date: '2023-10-25T11:00:00Z',
    referenceId: 'o1'
  },
  {
    id: 't2',
    userId: 'u5',
    userName: 'Alice Smith',
    type: 'fee',
    amount: 24,
    status: 'completed',
    date: '2023-10-25T11:00:00Z',
    referenceId: 'o1'
  },
  {
    id: 't3',
    userId: 'u6',
    userName: 'Bob Jones',
    type: 'withdrawal',
    amount: 500,
    status: 'pending',
    date: '2023-10-26T09:00:00Z'
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@sixerr.com',
    name: 'Super Admin',
    displayName: 'Admin',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    title: 'Platform Administrator',
    location: 'Headquarters',
    bio: 'I manage the platform.',
    skills: [],
    languages: [{ language: 'English', level: 'Native' }],
    isSeller: false,
    isAdmin: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isIdentityVerified: true,
    status: 'active',
    rating: 0,
    reviewsCount: 0,
    hourlyRate: 0,
    joinedAt: '2020-01-01T00:00:00Z',
    balance: 0,
    connects: 0,
    reviews: [],
    portfolio: []
  },
  {
    id: 'u5',
    username: 'alicesmith_dev',
    email: 'alice@example.com',
    name: 'Alice Smith',
    displayName: 'Alice S.',
    avatar: 'https://picsum.photos/seed/u5/100/100',
    title: 'Senior React Native Developer',
    location: 'New York, USA',
    bio: 'I am a passionate mobile developer with over 5 years of experience building high-quality iOS and Android applications. I specialize in React Native and have a keen eye for design.',
    skills: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'Node.js'],
    skillLevels: { 'React Native': 'Expert', 'TypeScript': 'Expert' },
    languages: [{ language: 'English', level: 'Native' }, { language: 'Spanish', level: 'Conversational' }],
    occupation: 'Mobile Development',
    isSeller: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isIdentityVerified: true,
    status: 'active',
    rating: 4.9,
    reviewsCount: 124,
    hourlyRate: 45,
    joinedAt: '2021-03-15T10:00:00Z',
    balance: 1500,
    connects: 50,
    reviews: [
      { id: 'r1', reviewerName: 'John Doe', rating: 5, comment: 'Alice is amazing! She delivered the app way ahead of schedule.', date: '2023-09-10' },
      { id: 'r2', reviewerName: 'Sarah Connor', rating: 4, comment: 'Great work, very professional.', date: '2023-08-05' }
    ],
    portfolio: [
      { id: 'pf1', image: 'https://picsum.photos/seed/pf1/400/300', title: 'E-commerce App' },
      { id: 'pf2', image: 'https://picsum.photos/seed/pf2/400/300', title: 'Fitness Tracker' },
      { id: 'pf3', image: 'https://picsum.photos/seed/pf3/400/300', title: 'Social Media Dashboard' }
    ]
  },
  {
    id: 'u6',
    username: 'bobjones_web',
    email: 'bob@example.com',
    name: 'Bob Jones',
    displayName: 'Bob J.',
    avatar: 'https://picsum.photos/seed/u6/100/100',
    title: 'Full Stack Web Developer',
    location: 'London, UK',
    bio: 'Full stack wizard with a love for clean code and scalable architecture. Expert in MERN stack.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
    languages: [{ language: 'English', level: 'Native' }],
    occupation: 'Web Development',
    isSeller: true,
    isEmailVerified: true,
    isPhoneVerified: false,
    isIdentityVerified: false,
    status: 'active',
    rating: 4.7,
    reviewsCount: 89,
    hourlyRate: 55,
    joinedAt: '2020-11-20T10:00:00Z',
    balance: 2300,
    connects: 20,
    reviews: [
      { id: 'r3', reviewerName: 'Mike Ross', rating: 5, comment: 'Bob solved a complex backend issue for us in hours.', date: '2023-10-01' }
    ],
    portfolio: [
      { id: 'pf4', image: 'https://picsum.photos/seed/pf4/400/300', title: 'SaaS Platform' },
      { id: 'pf5', image: 'https://picsum.photos/seed/pf5/400/300', title: 'Real Estate Website' }
    ]
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'u2',
    title: 'Build a React Native App for Food Delivery',
    description: 'We are looking for an experienced React Native developer to build a food delivery app similar to UberEats. The app should have user, driver, and restaurant interfaces.',
    budget: 3000,
    deadline: '2023-12-31',
    category: 'Mobile Development',
    skills: ['React Native', 'Firebase', 'Google Maps API'],
    proposalsCount: 5,
    postedAt: '2023-10-25T10:00:00Z',
  },
  {
    id: 'j2',
    clientId: 'u3',
    title: 'SEO Optimization for E-commerce Site',
    description: 'Need an SEO expert to audit and optimize our Shopify store. We want to rank for keywords related to "organic skincare".',
    budget: 500,
    deadline: '2023-11-15',
    category: 'Digital Marketing',
    skills: ['SEO', 'Shopify', 'Content Marketing'],
    proposalsCount: 12,
    postedAt: '2023-10-26T14:30:00Z',
  },
  {
    id: 'j3',
    clientId: 'u4',
    title: 'Logo Design for Tech Startup',
    description: 'We need a modern, minimalist logo for our AI startup "Neuraflow". Colors should be blue and purple.',
    budget: 200,
    deadline: '2023-11-01',
    category: 'Design',
    skills: ['Logo Design', 'Illustrator', 'Branding'],
    proposalsCount: 25,
    postedAt: '2023-10-27T09:15:00Z',
  },
];

export const MOCK_GIGS: Gig[] = [
  {
    id: 'g1',
    freelancerId: 'u5',
    freelancerName: 'Alice Smith',
    freelancerAvatar: 'https://picsum.photos/seed/u5/100/100',
    title: 'I will design a professional logo for your business',
    description: 'Get a unique and professional logo design for your business. I have 5 years of experience in branding.',
    image: 'https://picsum.photos/seed/g1/400/300',
    category: 'Graphics & Design',
    tags: ['logo', 'design', 'branding', 'minimalist', 'business'],
    rating: 4.9,
    reviewsCount: 120,
    startingPrice: 50,
    deliveryTime: 3,
    status: 'active',
    gallery: ['https://picsum.photos/seed/g1/400/300', 'https://picsum.photos/seed/g1-2/400/300'],
    faqs: [
      { question: 'Do you provide source files?', answer: 'Yes, in Standard and Premium packages.' }
    ],
    requirements: [
      { question: 'What is your business name?', type: 'text', required: true }
    ],
    packages: {
      basic: {
        name: 'Basic',
        description: '1 Logo Concept + High Resolution JPG & PNG',
        price: 50,
        deliveryTime: 3,
        revisions: 2,
        features: ['1 Concept', 'High Resolution', 'Transparent Background']
      },
      standard: {
        name: 'Standard',
        description: '2 Logo Concepts + Source Files + Vector Files',
        price: 120,
        deliveryTime: 5,
        revisions: 5,
        features: ['2 Concepts', 'High Resolution', 'Transparent Background', 'Source File', 'Vector File']
      },
      premium: {
        name: 'Premium',
        description: '3 Logo Concepts + All Files + Social Media Kit + VIP Support',
        price: 250,
        deliveryTime: 7,
        revisions: 0, // Unlimited
        features: ['3 Concepts', 'High Resolution', 'Transparent Background', 'Source File', 'Vector File', 'Social Media Kit', 'VIP Support']
      }
    }
  },
  {
    id: 'g2',
    freelancerId: 'u6',
    freelancerName: 'Bob Jones',
    freelancerAvatar: 'https://picsum.photos/seed/u6/100/100',
    title: 'I will write SEO optimized blog posts',
    description: 'High quality, engaging, and SEO optimized blog posts for your website. I cover tech, health, and lifestyle topics.',
    image: 'https://picsum.photos/seed/g2/400/300',
    category: 'Writing & Translation',
    tags: ['seo', 'writing', 'blog', 'content', 'article'],
    rating: 4.7,
    reviewsCount: 45,
    startingPrice: 30,
    deliveryTime: 2,
    status: 'active',
    gallery: ['https://picsum.photos/seed/g2/400/300'],
    faqs: [],
    requirements: [],
    packages: {
      basic: {
        name: 'Basic',
        description: '500 Words SEO Article',
        price: 30,
        deliveryTime: 2,
        revisions: 1,
        features: ['500 Words', 'SEO Optimization', 'Topic Research']
      },
      standard: {
        name: 'Standard',
        description: '1000 Words SEO Article + Keyword Research',
        price: 60,
        deliveryTime: 3,
        revisions: 2,
        features: ['1000 Words', 'SEO Optimization', 'Topic Research', 'Keyword Research']
      },
      premium: {
        name: 'Premium',
        description: '2000 Words SEO Article + Keyword Research + Images',
        price: 110,
        deliveryTime: 5,
        revisions: 3,
        features: ['2000 Words', 'SEO Optimization', 'Topic Research', 'Keyword Research', 'Stock Images']
      }
    }
  },
  {
    id: 'g3',
    freelancerId: 'u7',
    freelancerName: 'Charlie Brown',
    freelancerAvatar: 'https://picsum.photos/seed/u7/100/100',
    title: 'I will build a responsive WordPress website',
    description: 'Full website creation using Elementor Pro. Responsive, fast, and secure.',
    image: 'https://picsum.photos/seed/g3/400/300',
    category: 'Programming & Tech',
    tags: ['wordpress', 'website', 'elementor', 'design', 'responsive'],
    rating: 5.0,
    reviewsCount: 200,
    startingPrice: 150,
    deliveryTime: 5,
    status: 'active',
    gallery: ['https://picsum.photos/seed/g3/400/300'],
    faqs: [],
    requirements: [],
    packages: {
      basic: {
        name: 'Basic',
        description: 'One Page Website / Landing Page',
        price: 150,
        deliveryTime: 5,
        revisions: 3,
        features: ['1 Page', 'Responsive Design', 'Content Upload']
      },
      standard: {
        name: 'Standard',
        description: '5 Pages Website + E-commerce Functionality',
        price: 350,
        deliveryTime: 10,
        revisions: 5,
        features: ['5 Pages', 'Responsive Design', 'Content Upload', 'E-commerce', 'Speed Optimization']
      },
      premium: {
        name: 'Premium',
        description: '10 Pages Website + SEO + Security + 1 Month Support',
        price: 600,
        deliveryTime: 14,
        revisions: 0,
        features: ['10 Pages', 'Responsive Design', 'Content Upload', 'E-commerce', 'Speed Optimization', 'SEO Setup', 'Security Setup']
      }
    }
  },
];
