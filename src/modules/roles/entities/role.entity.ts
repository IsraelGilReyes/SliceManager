import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity {
    @ApiProperty({
        description: 'The unique identifier of the role',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The name of the role',
        example: 'Admin',
    })
    name: string;
}