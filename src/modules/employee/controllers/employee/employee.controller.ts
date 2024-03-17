import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../dto/update-employee.dto';
import { Employee } from '../../entities/employee.entity';
import { EmployeeService } from '../../services/employee/employee.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Employee[]; total: number }> {
    return this.employeeService.findAll(+page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeeService.delete(id);
  }
}
