import { CategoryDto } from "./CategoryDto";
import { SchoolingDto } from "./SchoolingDto";
import { SchoolingPartDto } from "./SchoolingPartDto";

export interface FullSchoolingDto {
    schooling?: SchoolingDto;
    category?: CategoryDto;
    parts?: SchoolingPartDto[];
}
