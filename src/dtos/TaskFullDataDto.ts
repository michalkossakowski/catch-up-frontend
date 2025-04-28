import { FullTaskDto } from "./FullTaskDto";
import { TaskCommentDto } from "./TaskCommentDto";
import { TaskTimeLogDto } from "./TaskTimeLogDto";

export interface TaskFullDataDto {
    fullTask: FullTaskDto;
    comments: TaskCommentDto[];
    commentsTotalCount: number;
    timelogs: TaskTimeLogDto[];
    timeLogTotalCount: number;
    hours: number;
    minutes: number;
  }