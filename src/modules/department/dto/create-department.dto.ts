import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  employees?: string[];
}
