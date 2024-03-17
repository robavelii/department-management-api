import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Employee } from 'src/modules/employee/entities/employee.entity';

@Entity()
@Tree('closure-table')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  parentDepartmentId: string;

  @TreeParent({ onDelete: 'CASCADE' })
  parentDepartment: Department;

  @TreeChildren()
  childDepartments: Department[];

  @OneToMany(() => Employee, (employee) => employee.department, {
    onDelete: 'CASCADE',
  })
  employees: Employee[];
}
