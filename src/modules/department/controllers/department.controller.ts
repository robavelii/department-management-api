import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { Department } from '../entities/department.entity';
import { DepartmentService } from '../services/department.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentService.getAllDepartments();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.getDepartmentById(id);
  }

  @Patch(':id/move/:newParentId')
  async moveDepartment(
    @Param('id') id: string,
    @Param('newParentId') newParentId: string,
  ): Promise<Department> {
    return this.departmentService.moveDepartment(id, newParentId);
  }

  @Get(':id/children')
  async getChildrenDepartments(@Param('id') id: string): Promise<Department[]> {
    return this.departmentService.getChildrenDepartments(id);
  }

  @Get(':id/descendants')
  async getDescendantDepartments(
    @Param('id') id: string,
  ): Promise<Department[]> {
    return this.departmentService.getDescendantDepartments(id);
  }

  @Get(':id/reporting-hierarchy')
  async getReportingHierarchy(@Param('id') id: string): Promise<Department[]> {
    return this.departmentService.getReportingHierarchy(id);
  }
  @Get(':departmentId1/is-descendant/:departmentId2')
  async isDescendant(
    @Param('departmentId1') departmentId1: string,
    @Param('departmentId2') departmentId2: string,
  ): Promise<boolean> {
    return this.departmentService.isDescendant(departmentId1, departmentId2);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.departmentService.deleteDepartment(id);
  }
}
