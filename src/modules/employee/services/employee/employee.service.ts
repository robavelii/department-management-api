import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../dto/update-employee.dto';
import { Employee } from '../../entities/employee.entity';
import { DepartmentService } from 'src/modules/department/services/department.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly departmentService: DepartmentService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { departmentId, ...employeeDto } = createEmployeeDto; // Extract departmentId from dto
    const department =
      await this.departmentService.getDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException(
        `Department with id ${departmentId} not found`,
      );
    }
    const employee = this.employeeRepository.create({
      ...employeeDto,
      department,
    });

    return this.employeeRepository.save(employee);
  }
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Employee[]; total: number }> {
    const [data, total] = await this.employeeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const { departmentId, ...employeeDto } = updateEmployeeDto; // Extract departmentId from dto
    const department =
      await this.departmentService.getDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException(
        `Department with id ${departmentId} not found`,
      );
    }

    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    Object.assign(employee, {
      ...employeeDto,
      department,
    });

    return this.employeeRepository.save(employee);
  }

  async delete(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
  }
}
