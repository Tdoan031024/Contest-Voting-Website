export interface Candidate {
  id: string;
  sbd: string;
  name: string;
  votes: number;
  imageUrl: string;
  description: string;
  biography?: string;
  detailsUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'PARTNER';
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  isActive: boolean;
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
}
