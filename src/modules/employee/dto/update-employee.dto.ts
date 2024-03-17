// update-employee.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateEmployeeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('ET')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}
