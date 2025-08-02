export interface User {
  _id: string;
  id?: number; // For backward compatibility
  firstName: string;
  lastName: string;
  age?: number;
  city: string;
  job: string;
  rating: number;
  views: number;
  phoneViews: number;
  description: string;
  profileImg?: string;
  createdAt?: string;
}