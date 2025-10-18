import { BadgeTypeCountEnum } from "../Enums/BadgeTypeCountEnum";

export interface BadgeDto {
    id: number;
    name: string;
    description: string;
    iconId: number | null;
    count?: number | null;
    countType?: BadgeTypeCountEnum | null;
    achievedDate?: Date | null;
}