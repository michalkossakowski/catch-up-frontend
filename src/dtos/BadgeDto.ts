import { BadgeTypeCountEnum } from "../Enums/BadgeTypeCountEnum";

export interface BadgeDto {
    id: number;
    name: string;
    description: string;
    iconSource: string;
    count?: number | null;
    countType?: BadgeTypeCountEnum | null;
}