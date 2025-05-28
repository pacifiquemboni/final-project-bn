import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTranscriptDto {
  @ApiProperty({
    description: 'ID of the school',
    example: 1,
  })

  schoolId: number;

  @ApiProperty({
    description: 'ID of the department',
    example: 1,
  })

  departmentId: number;

  @ApiProperty({
    description: 'Program name',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  program: string;

  // @ApiProperty({
  //     description: 'Ref number of Student',
  //     example: 2210035,
  // })
  @IsOptional()
  referenceNo: string;

  @ApiProperty({
    description: 'Name of the year of study',
    example: 'Year 1',
  })
  @IsString()
  @IsNotEmpty()
  yearOfStudyName: string;

  @ApiProperty({
    description: 'Academic year of study',
    example: "2023-2024",
  })

  yearOfStudyYear: string;

  // @ApiProperty({ example: '220020020', description: 'Student reference number' })
  // @IsString()
  refNo: string;

  // @ApiProperty({ example: 'M', description: 'Sex (M/F)' })
  // @IsString()
  sex: string;
  @IsOptional()
  @ApiProperty({
    description: 'Uploaded marksheet file',
    format: 'binary',
    required: false,
  })
  file?: string;



  marks: any;


  @ApiProperty({
    description: 'Transcript status',
    example: 'draft',
    enum: ['draft', 'hod-approved', 'hod-rejected', 'dean-approved', 'dean-rejected'],
    required: false,
  })
  @IsOptional()
  @IsEnum([
    'draft',
    'hod-approved',
    'hod-rejected',
    'dean-approved',
    'dean-rejected',
  ])
  status?: string;
}



export class QueryFindAllTranscriptRequestDto {
  @ApiProperty({
    description: 'School ID to filter by',
    required: false,
    example: 'school-123',
  })
  @IsOptional()

  schoolId?: string;

  @ApiProperty({
    description: 'Department ID to filter by',
    required: false,
    example: 'dept-456',
  })
  @IsOptional()

  departmentId?: string;

  @ApiProperty({
    description: 'Program name to filter by',
    required: false,
    example: 'Computer Science',
  })
  @IsOptional()

  program?: string;

  @ApiProperty({
    description: 'Student reference number to filter by',
    required: false,
    example: 'STD-2023-001',
  })
  @IsOptional()
  referenceNo?: string;

  @ApiProperty({
    description: 'Name of the year of study',
    example: 'Year 1',
  })
  @IsOptional()
  yearOfStudyName?: string;

  //   @ApiProperty({
  //     description: 'Status of the transcript request',
  //     required: false,
  //     example: 'pending',
  //     enum: ['draft',
  //         'hod-approved',
  //         'hod-rejected',
  //         'dean-approved',
  //         'dean-rejected',],
  //   })
  //   @IsOptional()

  //   status?: string;


}
