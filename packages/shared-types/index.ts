export type { User, Hospital, Doctor, Review, Location, Cost, CommunityPost } from '@prisma/client';
export { Role } from '@prisma/client';

export interface SearchResponse {
  hospitals: any[]; // Using generic any for now to avoid strict Prisma includes mapping in frontend package
  doctors: any[];
}
