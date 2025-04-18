import { ResourceTypeEnum } from "../Enums/ResourceTypeEnum";

export interface FeedbackDto {
    id?: number;
    title: string;
    description: string;
    senderId: string;
    receiverId: string;
    resourceType: ResourceTypeEnum;
    resourceId: number;
    materialId?: number;
    createdDate: Date;
    userSend?: string;
    userReceive?: string;
    resourceName?: string;
    isResolved: boolean;
}