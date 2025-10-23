export interface UserProfileDto {
  userId: string;
  bio?: string;
  department?: string;
  location?: string;
  phone?: string;
  teamsUsername?: string;
  slackUsername?: string;
  interests: string[];
  languages: string[];
}