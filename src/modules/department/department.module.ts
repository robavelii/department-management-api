import { Module } from '@nestjs/common';
import { DepartmentController } from './controllers/department.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './services/department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
