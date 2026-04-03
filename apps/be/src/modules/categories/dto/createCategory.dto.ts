import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Shirts' })
    @IsString()
    @IsNotEmpty()
    name: string;
}