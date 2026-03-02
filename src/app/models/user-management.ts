export interface User {
  id: number;
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

export interface UserQueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  status?: string; // 'active', 'inactive', etc.
  role?: string; // Role name
  createdAfter?: Date;
  createdBefore?: Date;
  sortBy?: string; // Property to sort by
  sortOrder?: string; // 'asc' or 'desc'
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserRoleUpdateDto {
  userId: string;
  roles: string[];
}