import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;

  const mockRolesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe obtener todos los roles', async () => {
    const roles = [
      { id: 1, name: 'ADMINISTRADOR' },
      { id: 2, name: 'GERENTE' },
    ];

    mockRolesService.findAll.mockResolvedValue(roles);

    const result = await controller.findAll();

    expect(mockRolesService.findAll).toHaveBeenCalled();
    expect(result).toEqual(roles);
  });

  it('debe obtener un rol por ID', async () => {
    const role = {
      id: 1,
      name: 'ADMINISTRADOR',
    };

    mockRolesService.findOne.mockResolvedValue(role);

    const result = await controller.findOne(1);

    expect(mockRolesService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(role);
  });

  it('debe crear un rol', async () => {
    const createRoleDto = {
      name: 'CAJERO',
    };

    const createdRole = {
      id: 3,
      name: 'CAJERO',
    };

    mockRolesService.create.mockResolvedValue(createdRole);

    const result = await controller.create(createRoleDto);

    expect(mockRolesService.create).toHaveBeenCalledWith(createRoleDto);
    expect(result).toEqual(createdRole);
  });

  it('debe actualizar un rol', async () => {
    const updateRoleDto = {
      name: 'SUPERVISOR',
    };

    const updatedRole = {
      id: 1,
      name: 'SUPERVISOR',
    };

    mockRolesService.update.mockResolvedValue(updatedRole);

    const result = await controller.update(1, updateRoleDto);

    expect(mockRolesService.update).toHaveBeenCalledWith(1, updateRoleDto);
    expect(result).toEqual(updatedRole);
  });

  it('debe eliminar un rol', async () => {
    const deletedRole = {
      id: 1,
      name: 'SUPERVISOR',
    };

    mockRolesService.remove.mockResolvedValue(deletedRole);

    const result = await controller.remove(1);

    expect(mockRolesService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(deletedRole);
  });
});