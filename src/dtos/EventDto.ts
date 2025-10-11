export interface EventDto {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: string | undefined;
  targetUserType: string;
}
