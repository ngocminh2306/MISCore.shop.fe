export type UserRole = 'customer' | 'admin' | 'moderator';

export interface User {
  id: string; // API returns string IDs
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePictureUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  roles: string[];
}