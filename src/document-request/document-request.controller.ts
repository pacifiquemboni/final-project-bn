import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, BadRequestException, UseGuards } from '@nestjs/common';
import { DocumentRequestService } from './document-request.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { UpdateDocumentRequestDto } from './dto/update-document-request.dto';
import { CreateRecomandationRequestDto, CreateToWhomRequestDto, QuerryFindAllRecomandationRequestDto, UpdateRecomandationRequestDto, UpdateRecomandationRequestStaffDto, UpdateToWhomRequestStaffDto } from './dto/create-recomandation.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileUploadConfig } from 'src/utils/file-upload-config';
import { CreateTranscriptChangesDto, CreateTranscriptRequestDto, HodUpdateTranscriptRequestDto, QuerryFindAllTranscriptRequestDto, UpdateTranscriptRequestDto } from './dto/create-transcript-request.dto';
import { CreateEnglishCertificateChangesDto, CreateEnglishCertificateDto, QuerryFindAllEnglishCertificateRequestDto, UpdateEnglishCertificateRequestDto, UpdateEnglishCertificateRequestStaffDto } from './dto/create-english-certificate.dto';
import { CreateDeclarationChangeDto, CreateDeclarationProofOfPaymentDto, CreateDeclarationRequestDto, QuerryFindAllDeclarationRequestDto, UpdateDeclarationRequestFinanceDto, UpdateDeclarationRequestLibraryDto, UpdateDeclarationRequestWelfareDto } from './dto/create-decration-request.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateTranscriptDto, QueryFindAllTranscriptRequestDto } from './dto/create-transcript.dto';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { Transcript } from './entities/transcripts-marks.entity';
import { Sequelize } from 'sequelize-typescript';


interface StudentRecord {
  refNo: string;
  sex: string;
  semesters: {
    semester1: Record<string, { mark: number; grade: string; credit: number }>;
    semester2: Record<string, { mark: number; grade: string; credit: number }>;
  };
  totalCredits: number | null;
  annualAverage: number | null;
  previousFailedModules: string[];
  currentFailedModules: string[];
  remark: string | null;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('recomandation-request')
export class DocumentRequestController {
  constructor(private readonly documentRequestService: DocumentRequestService) { }

  @Post('/recomandation')
  @ApiOperation({ summary: 'Request Recomandation letter' })
  create(@Body() createRecomandationRequestDto: CreateRecomandationRequestDto) {
    return this.documentRequestService.createRecomandnation(createRecomandationRequestDto);
  }

  @Get('/recomandation')
  @ApiOperation({ summary: 'Get all Recomandation letters by filters' })
  async findAll(@Query() querry: QuerryFindAllRecomandationRequestDto) {
    const whereClause: any = {};
    if (querry.regnumber) {
      whereClause.regnumber = querry.regnumber;
    }
    if (querry.requestedbyId) {
      whereClause.requestedbyId = querry.requestedbyId;
    }
    if (querry.assignedToId) {
      whereClause.assignedToId = querry.assignedToId;
    }
    if (querry.status) {
      whereClause.status = querry.status;
    }
    if (querry.schoolId) {
      whereClause.schoolId = querry.schoolId;
    }
    if (querry.departmentId) {
      whereClause.departmentId = querry.departmentId;
    }
    if (querry.fromDate && querry.toDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(querry.fromDate), new Date(querry.toDate)],
      };
    }

    return this.documentRequestService.findAllRecomandations(whereClause);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentRequestService.findOne(+id);
  }

  @Patch('/recomandation/:id')
  @ApiOperation({ summary: 'Update Recomandation letter by ID ⚠️ done by student' })
  update(@Param('id') id: string, @Body() updateRecomandationRequestDto: UpdateRecomandationRequestDto) {
    return this.documentRequestService.updateRecomandationByStudent(+id, updateRecomandationRequestDto);
  }

  @Patch('/recomandation/staff/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileurl',
      FileUploadConfig.getOptions('./uploads/recomandations'),
    ),
  )
  @ApiBody({ type: UpdateRecomandationRequestStaffDto, description: 'Form data for updating a recommendation request' })
  @ApiParam({ name: 'id', description: 'Recommendation request ID' })
  @ApiOperation({ summary: 'Update Recomandation letter by ID ⚠️ done by staff' })
  async updateByStaff(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateRecomandationRequestStaffDto: UpdateRecomandationRequestStaffDto,
  ) {
    if (file) {
      // Adjust file path to include server base path
      updateRecomandationRequestStaffDto.fileurl = `${process.env.base_url}/uploads/recomandations/${file.filename}`;
    }
    return this.documentRequestService.updateRecomandationByStaff(+id, updateRecomandationRequestStaffDto);
  }

}


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('transcript-request')

export class TranscriptRequestController {
  constructor(private readonly documentRequestService: DocumentRequestService,
    private readonly sequelize: Sequelize,

  ) { }
  @Post('/transcript')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor(FileUploadConfig.getOptions('./uploads'))
  )
  @ApiOperation({ summary: 'Request Transcript' })
  async createTranscriptRequest(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createTranscriptRequestDto: CreateTranscriptRequestDto
  ) {
    try {
      const passphotoFile = files.find(f => f.fieldname === 'passphoto');
      const proofOfPaymentFile = files.find(f => f.fieldname === 'proofofpayment');

      // Validate completion date
      if (createTranscriptRequestDto.completionYear) {
        const completionDate = new Date(createTranscriptRequestDto.completionYear); // "2023-05-25"

        if (isNaN(completionDate.getTime())) {
          throw new BadRequestException('Invalid completion date format. Expected "YYYY-MM-DD".');
        }

        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        const isOlderThanSixMonths = completionDate < sixMonthsAgo;

        if (isOlderThanSixMonths) {
          // Require proof of payment
          if (!proofOfPaymentFile) {
            throw new BadRequestException('Proof of payment is required for requests older than 6 months.');
          }
          createTranscriptRequestDto.proofofpayment = `${process.env.base_url}/uploads/${proofOfPaymentFile.filename}`;
        }
      }
      if (!passphotoFile) {
        throw new BadRequestException('Passport photo is required.');
      }
      createTranscriptRequestDto.passphoto = `${process.env.base_url}/uploads/${passphotoFile.filename}`;

      // Call the service once
      return await this.documentRequestService.createTranscriptRequest(createTranscriptRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create transcript request: ${error.message}`);
    }
  }
  @Post('/to-whom-request')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor(FileUploadConfig.getOptions('./uploads'))
  )
  @ApiOperation({ summary: 'Request To Whom It May Concern Letter' })
  async createToWhomRequest(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createToWhomRequestDto: CreateToWhomRequestDto
  ) {
    try {
      const file = files.find(f => f.fieldname === 'fileurl');
      const proofOfPaymentFile = files.find(f => f.fieldname === 'proofofpayment');

      if (file) {
        createToWhomRequestDto.fileurl = `${process.env.base_url}/uploads/${file.filename}`;
      }
      if (proofOfPaymentFile) {
        createToWhomRequestDto.proofofpayment = `${process.env.base_url}/uploads/${proofOfPaymentFile.filename}`;
      }

      return await this.documentRequestService.createToWhom(createToWhomRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create To Whom It May Concern request: ${error.message}`);
    }
  }
  @Get('/to-whom-request')
  @ApiOperation({ summary: 'Get all To Whom It May Concern requests by filters' })
  async findAllToWhomRequests(@Query() querry: QuerryFindAllRecomandationRequestDto) {
    const whereClause: any = {};
    if (querry.regnumber) {
      whereClause.regnumber = querry.regnumber;
    }
    if (querry.requestedbyId) {
      whereClause.requestedbyId = querry.requestedbyId;
    }
    if (querry.assignedToId) {
      whereClause.assignedToId = querry.assignedToId;
    }
    if (querry.status) {
      whereClause.status = querry.status;
    }
    if (querry.schoolId) {
      whereClause.schoolId = querry.schoolId;
    }
    if (querry.departmentId) {
      whereClause.departmentId = querry.departmentId;
    }
    if (querry.fromDate && querry.toDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(querry.fromDate), new Date(querry.toDate)],
      };
    }

    return this.documentRequestService.findAllToWhom(whereClause);
  }
  @Get('/to-whom-request/:id')
  @ApiOperation({ summary: 'Get a specific To Whom It May Concern request by ID' })
  async findOneToWhomRequest(@Param('id') id: string) {
    try {
      return await this.documentRequestService.findOneToWhom(+id);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve To Whom It May Concern request: ${error.message}`);
    }
  }
  @Patch('/to-whom-request/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileurl',
      FileUploadConfig.getOptions('./uploads/to-whom'),
    ),
  )
  @ApiBody({ type: UpdateToWhomRequestStaffDto, description: 'Form data for updating a To Whom It May Concern request' })
  @ApiOperation({ summary: 'Update To Whom It May Concern request by ID ⚠️ done by staff' })
  async updateToWhomRequestByStaff(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateToWhomRequestStaffDto: UpdateToWhomRequestStaffDto,
  ) {
    try {
      if (file) {
        updateToWhomRequestStaffDto.fileurl = `${process.env.base_url}/uploads/to-whom/${file.filename}`;
      }
      return await this.documentRequestService.updateToWhomByStaff(+id, updateToWhomRequestStaffDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update To Whom It May Concern request by staff: ${error.message}`);
    }
  }
  @Post('/transcript/changes')
  @ApiOperation({ summary: 'Request changes on a Transcript' })
  async createChangesOnTranscriptRequest(
    @Body() createTranscriptChangesDto: CreateTranscriptChangesDto
  ) {
    try {


      const transcriptChange = await this.documentRequestService.createChangesOnTranscriptRequest(createTranscriptChangesDto);

      return transcriptChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on transcript request: ${error.message}`);
    }
  }

  @Patch('/transcript/hod-approve/:userId')
  @ApiOperation({ summary: 'Approve Transcript request by HOD' })
  async hodUpdateTranscriptRequest(
    @Param('userId') userId: number,
    @Body() updateDocumentRequestDto: HodUpdateTranscriptRequestDto,
  ) {
    try {
      return await this.documentRequestService.HodUpdateTranscriptRequest(userId, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to approve transcript request by HOD: ${error.message}`);
    }
  }

  @Patch('/transcript/dean-approve/:userId')
  @ApiOperation({ summary: 'Approve Transcript request by Dean' })
  async deanUpdateTranscriptRequest(
    @Param('userId') userId: number,
    @Body() updateDocumentRequestDto: HodUpdateTranscriptRequestDto,
  ) {
    try {
      return await this.documentRequestService.deanUpdateTranscriptRequest(userId, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to approve transcript request by Dean: ${error.message}`);
    }
  }


  @Patch('/transcript/upload-file/:requestId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileurl',
      FileUploadConfig.getOptions('./uploads/generate-transcripts'),
    ),
  )
  @ApiOperation({ summary: 'Upload a file for a specific transcript request and transcript' })
  async uploadTranscriptFile(
    @Param('requestId') requestId: string,
    @UploadedFile() fileurl: Express.Multer.File,
  ) {
    try {
      const request = await this.documentRequestService.findOneRequest(+requestId);
      if (!request) {
        throw new BadRequestException(`Transcript request with ID ${requestId} not found.`);
      }
      if (!fileurl) {
        throw new BadRequestException('File is required.');
      }
      const fileUrl = `${process.env.base_url}/uploads/generate-transcripts/${fileurl.filename}`;

      request.fileurl = fileUrl; // Update the request with the file URL
      await this.documentRequestService.updateTranscriptFileUrl(+requestId, fileUrl);
      // You should implement this method in your service to handle the file URL storage logic

    } catch (error) {
      throw new BadRequestException(`Failed to upload transcript file: ${error.message}`);
    }
  }


  @Get('/transcript')
  @ApiOperation({ summary: 'Get all Transcript requests by filters' })
  async findAllTranscript(@Query() querry: QuerryFindAllTranscriptRequestDto) {
    const whereClause: any = {};
    if (querry.regnumber) {
      whereClause.regnumber = querry.regnumber;
    }
    if (querry.requestedbyId) {
      whereClause.requestedbyId = querry.requestedbyId;
    }
    if (querry.assignedToId) {
      whereClause.assignedToId = querry.assignedToId;
    }
    if (querry.status) {
      whereClause.status = querry.status;
    }
    if (querry.schoolId) {
      whereClause.schoolId = querry.schoolId;
    }
    if (querry.departmentId) {
      whereClause.departmentId = querry.departmentId;
    }
    if (querry.fromDate && querry.toDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(querry.fromDate), new Date(querry.toDate)],
      };
    }

    return this.documentRequestService.findAllTranscriptRequest(whereClause);
  }

  @Get('/transcript/:id')
  @ApiOperation({ summary: 'Get a specific Transcript request by ID' })
  async findOneTranscriptRequest(@Param('id') id: string) {
    try {
      return await this.documentRequestService.findOneRequest(+id);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve transcript request: ${error.message}`);
    }
  }

  @Patch('/transcript/staff/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileurl',
      FileUploadConfig.getOptions('./uploads/transcripts'),
    ),
  )
  @ApiBody({ type: UpdateTranscriptRequestDto, description: 'Form data for updating a transcript request by staff' })
  @ApiOperation({ summary: 'Update Transcript request by staff' })
  async updateTranscriptRequestByStaff(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentRequestDto: UpdateTranscriptRequestDto,
  ) {
    try {
      if (file) {
        updateDocumentRequestDto.fileurl = `${process.env.base_url}/uploads/transcripts/${file.filename}`;
      }
      return await this.documentRequestService.updateTranscriptRequestByStaff(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update transcript request by staff: ${error.message}`);
    }
  }

  private get transcriptModel() {
    return this.sequelize.getRepository(Transcript); // Assuming TranscriptRequest is also a TranscriptRequest
  }

  @Post('/marksheet')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'file',
      FileUploadConfig.getOptions('./uploads/transcripts'),
    ),
  )
  async createTranscript(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTranscriptDto,
  ) {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const semesterIndicatorRowIndex = 0;
      const courseCodeRowIndex = 1;
      const headerRowIndex = 0; // Adjust if necessary
      const dataStartIndex = 6;

      const semesterRow = data[semesterIndicatorRowIndex];
      const courseCodeRow = data[courseCodeRowIndex];
      const headerRow = data[headerRowIndex];

      // Find semester I and II boundaries
      let semesterIStart = -1;
      let semesterIIStart = -1;

      for (let i = 0; i < semesterRow.length; i++) {
        const cell = semesterRow[i]?.toString().trim().toUpperCase();
        if (cell === 'SEMESTERI' && semesterIStart === -1) {
          semesterIStart = i;
        } else if (cell === 'SEMESTERII' && semesterIIStart === -1) {
          semesterIIStart = i;
        }
      }

      if (semesterIStart === -1) semesterIStart = 3;
      if (semesterIIStart === -1) semesterIIStart = courseCodeRow.length;
      const creditRowIndex = 4;
      const creditRow = data[creditRowIndex];
      // Map column indices to course code and semester
      const courseColumns = {};
      for (let i = 3; i < courseCodeRow.length; i++) {
        const code = courseCodeRow[i];
        const credit = typeof creditRow[i] === 'number' ? creditRow[i] : 0;

        if (!code || typeof code !== 'string') continue;

        let semester = i >= semesterIIStart ? 'semester2' : 'semester1';
        courseColumns[i] = { code, semester, credit };
      }
      // Build header lookup map
      const headerMap = {};
      headerRow.forEach((cell, index) => {
        if (typeof cell === 'string') {
          const normalized = cell.trim().toLowerCase();
          headerMap[normalized] = index;
        }
      });

      const getHeaderIndex = (header: string): number | null => {
        const normalized = header.trim().toLowerCase();
        return headerMap[normalized] ?? null;
      };

      const totalCreditsIndex = getHeaderIndex('total credits (σci)');
      const annualAverageIndex = getHeaderIndex('Annual AV (%)');
      const prevFailedIndex = getHeaderIndex('previous failed modules');
      const currFailedIndex = getHeaderIndex('current failed modules');
      const remarkIndex = getHeaderIndex('remark');

      const gradeMapping = (mark: number) => {
        if (mark >= 70) return 'A';
        if (mark >= 60) return 'B';
        if (mark >= 50) return 'C';
        if (mark >= 45) return 'D';
        if (mark >= 40) return 'E';
        return 'F';
      };

      const commonFields = {
        schoolId: dto.schoolId,
        departmentId: dto.departmentId,
        program: dto.program,
        yearOfStudyName: dto.yearOfStudyName,
        yearOfStudyYear: dto.yearOfStudyYear,
        status: 'draft',
      };

      const results: CreateTranscriptDto[] = [];
      const skipped: any[] = [];

      for (let i = dataStartIndex; i < data.length; i += 4) {
        const row = data[i];
        if (!row || !Array.isArray(row)) continue;

        const refNo = row[1];
        const sex = row[2];

        dto.referenceNo = refNo; // Ensure refNo is set in the DTO
        console.log(`Processing student with reference number: ${refNo}`);

        // Check if transcript for this student already exists


        const semesters = { semester1: {}, semester2: {} };

        for (const [colIndexStr, value] of Object.entries(courseColumns)) {
          const { code, semester } = value as { code: string; semester: string };
          const colIndex = parseInt(colIndexStr, 10);
          const mark = typeof row[colIndex] === 'number' ? row[colIndex] : null;

          if (mark !== null) {
            const grade = gradeMapping(mark);
            const credit = (value as { code: string; semester: string; credit: number }).credit;

            semesters[semester][code] = { mark, grade, credit };
          }
        }

        const studentRecord: CreateTranscriptDto = {
          ...commonFields,
          referenceNo: refNo,
          refNo,
          sex,
          marks: {
            semesters,
            totalCredits:
              totalCreditsIndex !== null && typeof row[totalCreditsIndex] === 'number'
                ? row[totalCreditsIndex]
                : null,
            annualAverage:
              annualAverageIndex !== null && typeof row[annualAverageIndex] === 'number'
                ? row[annualAverageIndex]
                : null,
            previousFailedModules:
              prevFailedIndex !== null
                ? Array.isArray(row[prevFailedIndex])
                  ? row[prevFailedIndex]
                  : typeof row[prevFailedIndex] === 'string'
                    ? [row[prevFailedIndex]]
                    : []
                : [],
            currentFailedModules:
              currFailedIndex !== null && typeof row[currFailedIndex] === 'string'
                ? row[currFailedIndex].split(',').map(m => m.trim())
                : [],
            remark:
              remarkIndex !== null && typeof row[remarkIndex] === 'string'
                ? row[remarkIndex]
                : null,
          },
        };

        await this.documentRequestService.createTranscript(studentRecord);
        results.push(studentRecord);
      }

      return {
        message: 'Marksheets processed successfully',
        created: results.length,
        skipped: skipped.length,
        skippedDetails: skipped,
        data: results,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(` ${error.message || error}`);
    }
  }


  @Get('/see-transcript')
  @ApiOperation({ summary: 'Get Transcript requests by filters' })
  async findTranscript(@Query() query: QueryFindAllTranscriptRequestDto) {
    const whereClause: any = {};

    // Add the new filters
    if (query.schoolId) {
      whereClause.schoolId = query.schoolId;
    }
    if (query.departmentId) {
      whereClause.departmentId = query.departmentId;
    }
    if (query.program) {
      whereClause.program = query.program;
    }
    if (query.referenceNo) { // Changed from regnumber to refNo to match your earlier code
      whereClause.referenceNo = query.referenceNo;
    }

    // Keep existing filters

    if (query.yearOfStudyName) {
      whereClause.yearOfStudyName = query.yearOfStudyName;
    }

    return this.documentRequestService.findTranscrip(whereClause);
  }

  @Get('/see-oploaded-marks')
  @ApiOperation({ summary: 'Get Transcript requests by filters' })
  async findUploadedMarks() {


    return this.documentRequestService.findUploadedMarksSummary();
  }

}



@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('english-certificate-request')

export class EnglishCertificateRequestController {
  constructor(private readonly documentRequestService: DocumentRequestService) { }

  @Post('/english-certificate')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor(FileUploadConfig.getOptions('./uploads'))
  )
  @ApiOperation({ summary: 'Request English Certificate' })
  async createEnglishCertificateRequest(
    @UploadedFiles() files: Array<Express.Multer.File>,

    @Body() createEnglishCertificateDto: CreateEnglishCertificateDto
  ) {
    try {
      const transcriptFile = files.find(f => f.fieldname === 'transcripturl');
      const degreeFile = files.find(f => f.fieldname === 'degreeurl');
      const nidFile = files.find(f => f.fieldname === 'nidurl');
      const proofOfPaymentFile = files.find(f => f.fieldname === 'proofofpayment');

      if (!nidFile) {
        throw new BadRequestException('National ID file is required.');
      }
      createEnglishCertificateDto.nidurl = `${process.env.base_url}/uploads/${nidFile.filename}`;
      // Validate graduation year
      if (Number(createEnglishCertificateDto.graduationYear) > new Date().getFullYear()) {
        // throw new BadRequestException('Student is still studying, transcripts are required instead of an English certificate.');

        if (!transcriptFile) {
          throw new BadRequestException('Transcript file is required.');
        }
        createEnglishCertificateDto.transcripturl = `${process.env.base_url}/uploads/${transcriptFile.filename}`;
      } else {
        if (!degreeFile) {
          throw new BadRequestException('Degree file is required.');
        }
        createEnglishCertificateDto.degreeurl = `${process.env.base_url}/uploads/${degreeFile.filename}`;
      }

      if (!proofOfPaymentFile) {
        throw new BadRequestException('Proof of payment is required.');
      }
      createEnglishCertificateDto.proofofpayment = `${process.env.base_url}/uploads/${proofOfPaymentFile.filename}`;
      return await this.documentRequestService.createEnglishCertificateRequest(createEnglishCertificateDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create English certificate request: ${error.message}`);
    }
  }

  @Post('/english-certificate/changes')
  @ApiOperation({ summary: 'Request changes on an English Certificate' })
  async createChangesOnEnglishCertificateRequest(
    @Body() createEnglishCertificateChangesDto: CreateEnglishCertificateChangesDto
  ) {
    try {

      const englishChange = await this.documentRequestService.createChangesOnEnglishCertificateRequest(createEnglishCertificateChangesDto);
      return englishChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on English certificate request: ${error.message}`);
    }
  }
  @Get('/english-certificate/:id')
  @ApiOperation({ summary: 'Get a specific English Certificate request by ID' })
  async findOneEnglishCertificateRequest(@Param('id') id: string) {
    try {
      return await this.documentRequestService.findOneEnglishCertificateRequest(+id);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve English certificate request: ${error.message}`);
    }
  }

  @Get('/english-certificate')
  @ApiOperation({ summary: 'Get all English Certificate requests by filters' })
  async findAllEnglishCertificateRequests(@Query() querry: QuerryFindAllEnglishCertificateRequestDto) {
    const whereClause: any = {};
    if (querry.regnumber) {
      whereClause.regnumber = querry.regnumber;
    }
    if (querry.requestedbyId) {
      whereClause.requestedbyId = querry.requestedbyId;
    }
    if (querry.assignedToId) {
      whereClause.assignedToId = querry.assignedToId;
    }
    if (querry.status) {
      whereClause.status = querry.status;
    }

    try {
      return await this.documentRequestService.findAllEnglishCertificateRequest(whereClause);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve English certificate requests: ${error.message}`);
    }
  }

  @Patch('/english-certificate/staff/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileurl',
      FileUploadConfig.getOptions('./uploads/english-certificates'),
    ),
  )
  @ApiBody({ type: UpdateEnglishCertificateRequestStaffDto, description: 'Form data for updating an English certificate request by staff' })
  @ApiOperation({ summary: 'Update English Certificate request by staff' })
  async updateEnglishCertificateRequestStaff(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentRequestDto: UpdateEnglishCertificateRequestStaffDto,
  ) {
    try {
      if (file) {
        updateDocumentRequestDto.fileurl = `${process.env.base_url}/uploads/english-certificates/${file.filename}`;
      }
      return await this.documentRequestService.updateEnglishCertificateRequestStaff(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update English certificate request by staff: ${error.message}`);
    }
  }
  @Patch('/english-certificate/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor(FileUploadConfig.getOptions('./uploads'))
  )
  @ApiOperation({ summary: 'Update English Certificate request by student ⚠️not working well' })
  async updateEnglishCertificateRequestStudent(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateDocumentRequestDto: UpdateEnglishCertificateRequestDto,
  ) {
    try {
      const transcriptFile = files.find(f => f.fieldname === 'transcripturl');
      const degreeFile = files.find(f => f.fieldname === 'degreeurl');
      const nidFile = files.find(f => f.fieldname === 'nidurl');
      const proofOfPaymentFile = files.find(f => f.fieldname === 'proofofpayment');

      if (!nidFile) {
        throw new BadRequestException('National ID file is required.');
      }
      updateDocumentRequestDto.nidurl = `${process.env.base_url}/uploads/${nidFile.filename}`;

      if (Number(updateDocumentRequestDto.graduationYear) > new Date().getFullYear()) {
        if (!transcriptFile) {
          throw new BadRequestException('Transcript file is required.');
        }
        updateDocumentRequestDto.transcripturl = `${process.env.base_url}/uploads/${transcriptFile.filename}`;
      } else {
        if (!degreeFile) {
          throw new BadRequestException('Degree file is required.');
        }
        updateDocumentRequestDto.degreeurl = `${process.env.base_url}/uploads/${degreeFile.filename}`;
      }

      if (!proofOfPaymentFile) {
        throw new BadRequestException('Proof of payment is required.');
      }
      updateDocumentRequestDto.proofofpayment = `${process.env.base_url}/uploads/${proofOfPaymentFile.filename}`;

      return await this.documentRequestService.updateEnglishCertificateRequestStudent(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update English certificate request by student: ${error.message}`);
    }
  }
}


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('declaration-certificate-request')
export class DeclationCertificateRequestController {
  constructor(private readonly documentRequestService: DocumentRequestService) { }

  @Post()
  @ApiOperation({ summary: 'Request Declaration Certificate' })
  async createDeclarationCertificateRequest(
    @Body() createDeclarationRequestDto: CreateDeclarationRequestDto
  ) {
    try {


      return await this.documentRequestService.createDeclarationCertificateRequest(createDeclarationRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create declaration certificate request: ${error.message}`);
    }
  }

  @Post('/changes')
  @ApiOperation({ summary: 'Request changes on a Declaration Certificate' })
  async createChangesOnDeclarationCertificateRequest(
    @Body() createDeclarationChangeDto: CreateDeclarationChangeDto
  ) {
    try {

      const declarationChange = await this.documentRequestService.createChangesOnDeclarationCertificateRequest(createDeclarationChangeDto);
      return declarationChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on declaration certificate request: ${error.message}`);
    }
  }
  @Get()
  @ApiOperation({ summary: 'Get all Declaration Certificate requests by filters' })
  async findAllDeclarationRequests(@Query() querry: QuerryFindAllDeclarationRequestDto) {
    const whereClause: any = {};
    if (querry.regnumber) {
      whereClause.regnumber = querry.regnumber;
    }
    if (querry.requestedbyId) {
      whereClause.requestedbyId = querry.requestedbyId;
    }
    if (querry.libraryStatus) {
      whereClause.libraryStatus = querry.libraryStatus;
    }
    if (querry.financeStatus) {
      whereClause.financeStatus = querry.financeStatus;
    }
    if (querry.welfareStatus) {
      whereClause.welfareStatus = querry.welfareStatus;
    }

    try {
      return await this.documentRequestService.findAllDeclarationRequest(whereClause);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve declaration certificate requests: ${error.message}`);
    }
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Get a specific Declaration Certificate request by ID' })
  async findOneDeclarationCertificateRequest(@Param('id') id: string) {
    try {
      return await this.documentRequestService.findOneDeclarationRequest(+id);
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve declaration certificate request: ${error.message}`);
    }
  }

  @Post('/proof-of-payment/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'proofOfpaymentUrl',
      FileUploadConfig.getOptions('./uploads/declaration-proof-of-payment'),
    ),
  )
  @ApiBody({ type: CreateDeclarationProofOfPaymentDto, description: 'Form data for creating a proof of payment' })
  @ApiParam({ name: 'id', description: 'Recommendation request ID' })
  @ApiOperation({ summary: 'Submit proof of payment for a Declaration Certificate request' })
  async createProofOfPayment(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createProofOfPaymentDto: CreateDeclarationProofOfPaymentDto
  ) {
    try {
      if
        (!file) {
        throw new BadRequestException('Proof of payment file is required.');
      }
      createProofOfPaymentDto.proofOfpaymentUrl = `${process.env.base_url}/uploads/declaration-proof-of-payment/${file.filename}`;
      const proofOfPayment = await this.documentRequestService.createProofOfPayment(id, createProofOfPaymentDto);
      return proofOfPayment;
    } catch (error) {
      throw new BadRequestException(`Failed to create proof of payment: ${error.message}`);
    }
  }

  @Patch('/library/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'libraryFileUrl',
      FileUploadConfig.getOptions('./uploads/declaration-library'),
    ),
  )
  @ApiBody({ type: UpdateDeclarationRequestLibraryDto, description: 'Form data for updating a declaration request by library' })
  @ApiOperation({ summary: 'Update Declaration Certificate request by Librarian' })
  async updateDeclarationRequestLibrary(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentRequestDto: UpdateDeclarationRequestLibraryDto
  ) {
    try {
      if (file) {
        // Adjust file path to include server base path
        updateDocumentRequestDto.libraryFileUrl = `${process.env.base_url}/uploads/declaration-library/${file.filename}`;
      }
      return await this.documentRequestService.updateDeclarationRequestLibrary(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update declaration request by library: ${error.message}`);
    }
  }

  @Patch('/finance/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'financeFileUrl',
      FileUploadConfig.getOptions('./uploads/declaration-finance'),
    ),
  )
  @ApiBody({ type: UpdateDeclarationRequestFinanceDto, description: 'Form data for updating a declaration request by finance' })
  @ApiOperation({ summary: 'Update Declaration Certificate request by Financial manager' })
  async updateDeclarationRequestFinance(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentRequestDto: UpdateDeclarationRequestFinanceDto
  ) {
    try {
      if (file) {
        // Adjust file path to include server base path
        updateDocumentRequestDto.financeFileUrl = `${process.env.base_url}/uploads/declaration-finance/${file.filename}`;
      }
      return await this.documentRequestService.updateDeclarationRequestFinance(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update declaration request by finance: ${error.message}`);
    }
  }

  @Patch('/welfare/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'welfareFileUrl',
      FileUploadConfig.getOptions('./uploads/declaration-welfare'),
    ),
  )
  @ApiBody({ type: UpdateDeclarationRequestWelfareDto, description: 'Form data for updating a declaration request by welfare' })
  @ApiOperation({ summary: 'Update Declaration Certificate request by dean of student Welfare' })
  async updateDeclarationRequestWelfare(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentRequestDto: UpdateDeclarationRequestWelfareDto
  ) {
    try {
      if (file) {
        // Adjust file path to include server base path
        updateDocumentRequestDto.welfareFileUrl = `${process.env.base_url}/uploads/declaration-welfare/${file.filename}`;
      }
      return await this.documentRequestService.updateDeclarationRequestWelfare(+id, updateDocumentRequestDto);
    } catch (error) {
      throw new BadRequestException(`Failed to update declaration request by welfare: ${error.message}`);
    }
  }
}
