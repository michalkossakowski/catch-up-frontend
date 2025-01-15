import { ResourceTypeEnum } from "../Enums/ResourceTypeEnum";

export interface FeedbackDto {
    id?: number;
    title: string;
    description: string;
    senderId: string;
    receiverId: string;
    resourceType: ResourceTypeEnum;
    resourceId: number;
    createdDate: Date;
    senderName?: string;
    senderSurname?: string;
    receiverName?: string;
    receiverSurname?: string;
    resourceTitle?: string;
}