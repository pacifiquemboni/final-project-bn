import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, BadRequestException, UseGuards } from '@nestjs/common';
import { DocumentRequestService } from './document-request.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { UpdateDocumentRequestDto } from './dto/update-document-request.dto';
import { CreateRecomandationRequestDto, QuerryFindAllRecomandationRequestDto, UpdateRecomandationRequestDto, UpdateRecomandationRequestStaffDto } from './dto/create-recomandation.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileUploadConfig } from 'src/utils/file-upload-config';
import { CreateTranscriptChangesDto, CreateTranscriptRequestDto, QuerryFindAllTranscriptRequestDto, UpdateTranscriptRequestDto } from './dto/create-transcript-request.dto';
import { CreateEnglishCertificateChangesDto, CreateEnglishCertificateDto, QuerryFindAllEnglishCertificateRequestDto, UpdateEnglishCertificateRequestDto, UpdateEnglishCertificateRequestStaffDto } from './dto/create-english-certificate.dto';
import { CreateDeclarationChangeDto, CreateDeclarationProofOfPaymentDto, CreateDeclarationRequestDto, QuerryFindAllDeclarationRequestDto, UpdateDeclarationRequestFinanceDto, UpdateDeclarationRequestLibraryDto, UpdateDeclarationRequestWelfareDto } from './dto/create-decration-request.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

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
  constructor(private readonly documentRequestService: DocumentRequestService) { }
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
      const proofOfPayment = await this.documentRequestService.createProofOfPayment(id,createProofOfPaymentDto);
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
