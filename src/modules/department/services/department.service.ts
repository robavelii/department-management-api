import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: TreeRepository<Department>,
  ) {}

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const { name, description, parentDepartmentId } = createDepartmentDto;
    const parentDepartment = parentDepartmentId
      ? await this.getDepartmentById(parentDepartmentId)
      : null;
    const department = this.departmentRepository.create({
      name,
      description,
      parentDepartment,
    });
    return this.departmentRepository.save(department);
  }

  async getAllDepartments() {
    return this.departmentRepository.find({
      relations: ['employees', 'parentDepartment', 'childDepartments'],
      order: { name: 'ASC' },
    });
  }

  async getDepartmentById(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['employees', 'parentDepartment', 'childDepartments'],
    });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const { name, description, parentDepartmentId } = updateDepartmentDto;
    const department = await this.getDepartmentById(id);
    department.name = name || department.name;
    department.description = description || department.description;
    if (
      parentDepartmentId !== undefined &&
      parentDepartmentId !== department.parentDepartment?.id
    ) {
      const newParent = parentDepartmentId
        ? await this.getDepartmentById(parentDepartmentId)
        : null;
      if (newParent && (await this.isDescendant(id, parentDepartmentId))) {
        throw new BadRequestException(
          'The new parent department cannot be a descendant of the current department.',
        );
      }
      department.parentDepartment = newParent;
    } else if (parentDepartmentId === null) {
      department.parentDepartment = null;
    }
    return this.departmentRepository.save(department);
  }

  async deleteDepartment(id: string) {
    const department = await this.getDepartmentById(id);
    if (department.childDepartments.length > 0) {
      throw new BadRequestException(
        'Cannot delete department with child departments',
      );
    }
    await this.departmentRepository.remove(department);
  }

  async moveDepartment(id: string, newParentId: string) {
    const department = await this.getDepartmentById(id);
    const newParent = newParentId
      ? await this.getDepartmentById(newParentId)
      : null;
    if (newParent && (await this.isDescendant(id, newParentId))) {
      throw new BadRequestException(
        'Cannot make a department a descendant of its own child',
      );
    }
    department.parentDepartment = newParent;
    return this.departmentRepository.save(department);
  }

  async getChildrenDepartments(id: string) {
    const department = await this.getDepartmentById(id);
    return department.childDepartments;
  }

  // async getDescendantDepartments(id: string) {
  //   const department = await this.getDepartmentById(id);
  //   const descendants =
  //     await this.departmentRepository.findDescendants(department);
  //   return descendants.filter((descendant) => descendant.id !== id);
  // }

  async getDescendantDepartments(id: string) {
    const department = await this.getDepartmentById(id);
    const descendants =
      await this.departmentRepository.findDescendants(department);

    console.info('Descendants: ', descendants);
    const departmentMap = new Map<string, any>();

    for (const descendant of descendants) {
      departmentMap.set(descendant.id, {
        id: descendant.id,
        name: descendant.name,
        description: descendant.description,
        parentDepartmentId: descendant.parentDepartmentId,
        children: [],
      });
    }

    const tree = [];

    for (const descendant of descendants) {
      if (descendant.parentDepartmentId) {
        const parentDepartment = departmentMap.get(
          descendant.parentDepartmentId,
        );
        if (parentDepartment) {
          parentDepartment.children.push(departmentMap.get(descendant.id));
        }
      } else {
        tree.push(departmentMap.get(descendant.id));
      }
    }

    return tree;
  }

  async getReportingHierarchy(id: string) {
    const department = await this.getDepartmentById(id);
    let currentDepartment = department;
    const hierarchy: Department[] = [];
    while (currentDepartment.parentDepartment) {
      hierarchy.push(currentDepartment.parentDepartment);
      currentDepartment = currentDepartment.parentDepartment;
    }
    return hierarchy.reverse();
  }
  async isDescendant(departmentId1: string, departmentId2: string) {
    const role = await this.getDepartmentById(departmentId1);
    const descendants = await this.departmentRepository.findDescendants(role);
    return descendants.reduce((isDescendant, descendant) => {
      return isDescendant || descendant.id === departmentId2;
    }, false);
  }
}
