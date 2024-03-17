import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../../department/entities/department.entity';

export enum Gender {
  Male = 'M',
  Female = 'F',
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column('date')
  birthDate: Date;

  @Column('date')
  startDate: Date;

  @Column('date', { nullable: true })
  endDate: Date;

  @Column()
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;
}
