import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from '../entities/employee.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber('ET')
  phone: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @ApiProperty()
  @IsUUID()
  departmentId: string;
}
