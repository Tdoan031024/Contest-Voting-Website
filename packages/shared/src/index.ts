export interface Candidate {
  id: string;
  sbd: string;
  name: string;
  votes: number;
  imageUrl: string;
  description: string;
  biography?: string;
  detailsUrl?: string;
  contestTable?: 'HIGH_SCHOOL' | 'STUDENT' | 'ENTERPRISE';
  contestTableLabel?: string;
  sector?: string;
  stage?: string;
  status?: string;
  currentRound?: string;
  teamName?: string;
  representativeSchool?: string;
  leaderName?: string;
  leaderPhone?: string;
  leaderEmail?: string;
  advisorName?: string;
  members?: string;
  supportNeeds?: string;
  expectations?: string;
  implementationLocation?: string;
  intellectualPropertyCommitment?: boolean;
  showcaseImages?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'PARTNER';
  description?: string;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  isActive: boolean;
  round?: string;
  isImportant?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export interface VoteRecord {
  id: string;
  candidateId: string;
  voterPhone: string;
  voteTime: Date;
  transactionId?: string;
  eventId?: string;
  packageId?: string;
  points?: number;
  voteType?: 'FREE' | 'PAID';
  userId?: string;
  amount?: number;
}

export interface WebUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  provider: 'email' | 'google' | 'quick';
  role: 'USER';
  status: 'ACTIVE' | 'LOCKED';
  schoolOrCompany?: string;
  contestTable?: string;
  registeredAt: string;
  lastLoginAt?: string;
  votedPoints?: number;
}

export interface VotePackage {
  id: string;
  code: string;
  name: string;
  points: number;
  price: number;
  currency: 'VND';
  vatRate: number;
  packageType: 'FREE' | 'PAID';
  isActive: boolean;
}
