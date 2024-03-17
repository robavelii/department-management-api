import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeController } from './controllers/employee/employee.controller';
import { EmployeeService } from './services/employee/employee.service';
import { DepartmentModule } from '../department/department.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), DepartmentModule],

  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
