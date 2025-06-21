import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRecomandationRequestDto, UpdateRecomandationRequestDto, UpdateRecomandationRequestStaffDto } from './dto/create-recomandation.dto';
import { UpdateDocumentRequestDto } from './dto/update-document-request.dto';
import { Sequelize } from 'sequelize-typescript';
import { RecommendationLetter } from './entities/recomandation-letter.entity';
import { CreateTranscriptChangesDto, CreateTranscriptRequestDto, HodUpdateTranscriptRequestDto, UpdateTranscriptRequestDto } from './dto/create-transcript-request.dto';
import { TranscriptRequest } from './entities/transcript-request.entity';
import { TranscriptChanges } from './entities/transcript-changes.entity';
import { CreateEnglishCertificateChangesDto, CreateEnglishCertificateDto, UpdateEnglishCertificateRequestDto, UpdateEnglishCertificateRequestStaffDto } from './dto/create-english-certificate.dto';
import { EnglishCertificate } from './entities/english-certificate.entity';
import { EnglishChanges } from './entities/english-changes.entity';
import { CreateDeclarationChangeDto, CreateDeclarationProofOfPaymentDto, CreateDeclarationRequestDto, UpdateDeclarationRequestFinanceDto, UpdateDeclarationRequestLibraryDto, UpdateDeclarationRequestWelfareDto } from './dto/create-decration-request.dto';
import { DeclarationCertificate } from './entities/declaration-certificate.entity';
import { DeclarationChanges } from './entities/declaration-changes.entity';
import { DeclarationProofOfPayment } from './entities/declaration-proof-of-payment.entity';
import { CreateTranscriptDto } from './dto/create-transcript.dto';
import { Transcript } from './entities/transcripts-marks.entity';
import { School } from 'src/settings/entities/school.entity';
import { Department } from 'src/settings/entities/department.entity';
import { User } from 'src/users/entities/user.entity';
import { TranscriptWorkFlow } from './entities/transcriptWorkflow';
import { log } from 'console';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DocumentRequestService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly mailService: MailService, // Assuming you have a MailService for sending emails
  ) { }
  private get schoolRepository() {
    return this.sequelize.getRepository(School); // Assuming School is a model in your Sequelize setup
  }
  private get departmentRepository() {
    return this.sequelize.getRepository(Department); // Assuming Department is a model in your Sequelize setup
  }
  private get recomendationLetterRepository() {
    return this.sequelize.getRepository(RecommendationLetter);
  }
  async createRecomandnation(createRecomandationRequestDto: CreateRecomandationRequestDto) {
    try {
      const existingRequest = await this.recomendationLetterRepository.findOne({
        where: { regnumber: createRecomandationRequestDto.regnumber, status: 'PENDING' },
      });

      if (existingRequest) {
        throw new BadRequestException('Sorry you still have pending request.');
      }

      return await this.recomendationLetterRepository.create({
        ...createRecomandationRequestDto,
        status: 'PENDING'
      } as RecommendationLetter);
    } catch (error) {
      throw new BadRequestException(`Failed to create recommendation: ${error.message}`);
    }
  }

  findAllRecomandations(querry) {
    return this.recomendationLetterRepository.findAll(
      {
        where: querry,
        include: [
          { model: this.schoolRepository, as: 'school', attributes: ['name'] },
          { model: this.departmentRepository, as: 'department', attributes: ['name'] },
          { model: User, as: 'requestedBy', attributes: ['firstName', 'lastName', 'email'] },
          { model: User, as: 'assignedTo', attributes: ['firstName', 'lastName', 'email'] },
        ],
        order: [['createdAt', 'DESC']]
      },

    );
  }




  async findOne(id: number) {
    const recommendation = await this.recomendationLetterRepository.findByPk(id);
    if (!recommendation) {
      throw new BadRequestException(`Recommendation with ID #${id} not found.`);
    }
    return recommendation;
  }

  async updateRecomandationByStudent(id: number, updateRecomandationRequestDto: UpdateRecomandationRequestDto) {
    const recommendation = await this.recomendationLetterRepository.findByPk(id);
    if (!recommendation) {
      throw new BadRequestException(`Recommendation with ID #${id} not found.`);
    }
    await recommendation.update(updateRecomandationRequestDto);
    return recommendation;
  }

  async updateRecomandationByStaff(id: number, updateRecomandationRequestStaffDto: UpdateRecomandationRequestStaffDto) {
    const recommendation = await this.recomendationLetterRepository.findByPk(id);
    if (!recommendation) {
      throw new BadRequestException(`Recommendation with ID #${id} not found.`);
    }
    if (!updateRecomandationRequestStaffDto.fileurl) {
      throw new BadRequestException(`File URL is required.`);
    }

    await recommendation.update(updateRecomandationRequestStaffDto);
    return recommendation;
  }

  private get transcriptRequestRepository() {
    return this.sequelize.getRepository(TranscriptRequest);
  }

  async createTranscriptRequest(createTranscriptRequestDto: CreateTranscriptRequestDto) {
    try {
      const existingRequest = await this.transcriptRequestRepository.findOne({
        where: { regnumber: createTranscriptRequestDto.regnumber, levelOfStudy: createTranscriptRequestDto.levelOfStudy, status: 'PENDING' },
      });

      if (existingRequest) {
        throw new BadRequestException('Sorry you still have pending request.');
      }

      return await this.transcriptRequestRepository.create({
        ...createTranscriptRequestDto,
        status: 'PENDING'
      } as TranscriptRequest);
    } catch (error) {
      throw new BadRequestException(`Failed to create transcript request: ${error.message}`);
    }
  }
  private get transcriptChangesRepository() {
    return this.sequelize.getRepository(TranscriptChanges);
  }
  async createChangesOnTranscriptRequest(createTranscriptChangesDto: CreateTranscriptChangesDto) {
    try {


      const transcriptRequest = await this.transcriptRequestRepository.findByPk(createTranscriptChangesDto.requestId);
      if (!transcriptRequest) {
        throw new BadRequestException(`Transcript request with ID #${createTranscriptChangesDto.requestId} not found.`);
      }

      const transcriptChange = await this.transcriptChangesRepository.create({
        ...createTranscriptChangesDto,
      } as TranscriptChanges);

      return transcriptChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on transcript request: ${error.message}`);
    }
  }

  private get transcriptModel() {
    return this.sequelize.getRepository(Transcript); // Assuming TranscriptRequest is also a TranscriptRequest
  }
  async HodUpdateTranscriptRequest(userId: number, updateDocumentRequestDto: HodUpdateTranscriptRequestDto) {
    const transcriptRequest = await this.transcriptRequestRepository.findOne({
      where: { id: updateDocumentRequestDto.requestId, status: 'PENDING' },
    });

    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${updateDocumentRequestDto.requestId} not found or already processed.`);
    }
    const transcriptExists = await this.transcriptModel.findOne({
      where: { id: updateDocumentRequestDto.transcriptId, },
    },);
    if (!transcriptExists) {
      throw new BadRequestException(`Transcript with ID #${updateDocumentRequestDto.transcriptId} not found.`);
    }
    const user = await this.sequelize.getRepository(User).findByPk(userId);
    if (!user) {
      throw new BadRequestException(`User with ID #${userId} not found.`);
    }

    transcriptRequest.set('status', 'PROCESSING');
    await transcriptRequest.save();

    transcriptExists.set('status', 'hod-approved');
    await transcriptExists.save();

    transcriptExists.set('hodSignatureImage', user.dataValues.signature);
    await transcriptExists.save();

    transcriptExists.set('hodSignatureAt', new Date());
    await transcriptExists.save();

    return 'Transcript request Approved successfully';
  }

  async deanUpdateTranscriptRequest(userId: number, updateDocumentRequestDto: HodUpdateTranscriptRequestDto) {
    const transcriptRequest = await this.transcriptRequestRepository.findOne({
      where: { id: updateDocumentRequestDto.requestId, status: 'PROCESSING' },
    });
    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${updateDocumentRequestDto.requestId} not found or already processed.`);
    }
    const transcriptExists = await this.transcriptModel.findOne({
      where: { id: updateDocumentRequestDto.transcriptId, },
    },);
    if (!transcriptExists) {
      throw new BadRequestException(`Transcript with ID #${updateDocumentRequestDto.transcriptId} not found.`);
    }
    const user = await this.sequelize.getRepository(User).findByPk(userId);
    if (!user) {
      throw new BadRequestException(`User with ID #${userId} not found.`);
    }
    const school = await this.schoolRepository.findByPk(user.dataValues.schoolId);
    if (!school) {
      throw new BadRequestException(`School with ID #${transcriptRequest.schoolId} not found.`);
    }

    transcriptRequest.set('status', 'APPROVED');
    await transcriptRequest.save();

    transcriptExists.set('status', 'dean-approved');
    await transcriptExists.save();

    transcriptExists.set('schoolStampImage', school.dataValues.stamp);
    await transcriptExists.save();

    transcriptExists.set('deanSignatureImage', user.dataValues.signature);
    await transcriptExists.save();

    transcriptExists.set('schoolStampAt', new Date());
    await transcriptExists.save();

    return 'Transcript request Approved successfully';

  }



  async findAllTranscriptRequest(querry) {
    return this.transcriptRequestRepository.findAll({ where: querry, order: [['createdAt', 'DESC']] }

    );
  }

  async findOneRequest(id: number) {
    const transcriptRequest = await this.transcriptRequestRepository.findByPk(id, {
      include: [
        { model: this.transcriptChangesRepository, as: 'transcriptChanges' },
        { model: this.schoolRepository, as: 'school', attributes: ['name'] },
        { model: this.departmentRepository, as: 'department', attributes: ['name'] },
      ],
    });
    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${id} not found.`);
    }
    return transcriptRequest;
  }

  async updateTranscriptFileUrl(id: number, fileUrl: string) {
    const transcriptRequest = await this.transcriptRequestRepository.findOne({ where: { id } });
    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${id} not found.`);
    }
    // console.log('transcriptRequest', transcriptRequest.dataValues);
    const transcriptData = transcriptRequest.dataValues
    console.log('transcript', transcriptData.regnumber);

    const user = await this.sequelize.getRepository(User).findOne({ where: { regNumber: transcriptData.regnumber } });
    if (!user) {
      throw new BadRequestException(`Student with RegNumber #${transcriptRequest.regnumber} not found.`);
    }
    transcriptRequest.set('fileurl', fileUrl);
    await transcriptRequest.save();
    // console.log('user', user.dataValues.email);

    // Send the file link to the user's email
    await this.mailService.sendMail(
      user.dataValues.email,
      'Your Official Transcript is Now Available',
      `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
      <p>Dear ${user.dataValues.firstName || user.dataValues.lastName},</p>

      <p>We are pleased to inform you that your official transcript has been successfully processed and is now available for download.</p>

      <p>You can securely access your transcript using the link below:</p>

      <p>
        <a href="${fileUrl}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">
          Download Your Transcript
        </a>
      </p>

      <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>

      <p>Best regards,<br/>The UniDoc Team</p>
    </div>
  `
    );

    return transcriptRequest;
  }
  async updateTranscriptRequestByStaff(id: number, updateDocumentRequestDto: UpdateTranscriptRequestDto) {
    const transcriptRequest = await this.transcriptRequestRepository.findByPk(id);
    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${id} not found.`);
    }

    await transcriptRequest.update(updateDocumentRequestDto);
    return transcriptRequest;
  }


  async createTranscript(dto: CreateTranscriptDto): Promise<any> {
    try {

      const transcript = await this.transcriptModel.create({ ...dto as any });
      return transcript;
    } catch (error) {
      throw new BadRequestException(` ${error.message}`);
    }
  }
  async transcriptExists(filter: {
    schoolId: number;
    departmentId: number;
    program: string;
    yearOfStudyName: string;
    yearOfStudyYear: string;
    referenceNo: string;
  }): Promise<boolean> {
    return !!(await this.transcriptModel.findOne({ where: filter }));
  }

  async findTranscrip(querry) {
    return this.transcriptModel.findAll({ where: querry }
    );
  }
  async findUploadedMarksSummary() {
    // Group by the specified fields and count the number of records in each group
    const results = await this.transcriptModel.findAll({
      attributes: [
        'schoolId',
        'departmentId',
        'program',
        'yearOfStudyName',
        'yearOfStudyYear',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'numberOfRecords'],
        [this.sequelize.fn('MAX', this.sequelize.col('createdAt')), 'uploadedDate'],
      ],
      group: [
        'schoolId',
        'departmentId',
        'program',
        'yearOfStudyName',
        'yearOfStudyYear'
      ],
      raw: true,
      order: [
        ['schoolId', 'DESC'],
        ['departmentId', 'DESC'],
        ['program', 'DESC'],
        ['yearOfStudyName', 'DESC'],
        ['yearOfStudyYear', 'DESC']
      ],
    });

    return results;
  }
  private get englishCertificateRepository() {
    return this.sequelize.getRepository(EnglishCertificate); // Assuming EnglishCertificate is also a TranscriptRequest
  }
  async createEnglishCertificateRequest(createEnglishCertificateDto: CreateEnglishCertificateDto) {
    try {
      const existingRequest = await this.englishCertificateRepository.findOne({
        where: { regnumber: createEnglishCertificateDto.regnumber, status: 'PENDING' },
      });
      if (existingRequest) {
        throw new BadRequestException('Sorry you still have pending request.');
      }


      return await this.englishCertificateRepository.create({
        ...createEnglishCertificateDto,
        status: 'PENDING'
      } as EnglishCertificate);
    } catch (error) {
      throw new BadRequestException(`Failed to create English certificate request: ${error.message}`);
    }
  }

  async findAllEnglishCertificateRequest(querry) {
    return this.englishCertificateRepository.findAll({ where: querry }
    );
  }
  async findOneEnglishCertificateRequest(id: number) {
    const englishCertificateRequest = await this.englishCertificateRepository.findByPk(id, {
      include: [
        { model: this.englishChangesRepository, as: 'englishChanges', attributes: ['comment'] },
      ],
    });
    if (!englishCertificateRequest) {
      throw new BadRequestException(`English certificate request with ID #${id} not found.`);
    }
    return englishCertificateRequest;
  }
  async updateEnglishCertificateRequestStaff(id: number, updateDocumentRequestDto: UpdateEnglishCertificateRequestStaffDto) {
    const englishCertificateRequest = await this.englishCertificateRepository.findByPk(id);
    if (!englishCertificateRequest) {
      throw new BadRequestException(`English certificate request with ID #${id} not found.`);
    }
    updateDocumentRequestDto.status = 'APPROVED'
    englishCertificateRequest.set('status', 'APPROVED');
    await englishCertificateRequest.update(updateDocumentRequestDto);
    return englishCertificateRequest;
  }
  async updateEnglishCertificateRequestStudent(id: number, updateDocumentRequestDto: UpdateEnglishCertificateRequestDto) {
    const englishCertificateRequest = await this.englishCertificateRepository.findByPk(id);
    if (!englishCertificateRequest) {
      throw new BadRequestException(`English certificate request with ID #${id} not found.`);
    }
    await englishCertificateRequest.update(updateDocumentRequestDto);
    return englishCertificateRequest;
  }

  private get englishChangesRepository() {
    return this.sequelize.getRepository(EnglishChanges); // Assuming EnglishChanges is also a TranscriptRequest
  }
  async createChangesOnEnglishCertificateRequest(createEnglishCertificateChangesDto: CreateEnglishCertificateChangesDto) {
    try {
      const englishCertificateRequest = await this.englishCertificateRepository.findByPk(createEnglishCertificateChangesDto.requestId);
      if (!englishCertificateRequest) {
        throw new BadRequestException(`English certificate request with ID #${createEnglishCertificateChangesDto.requestId} not found.`);
      }

      const englishChange = await this.englishChangesRepository.create({
        ...createEnglishCertificateChangesDto,
      } as EnglishChanges);
      return englishChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on English certificate request: ${error.message}`);
    }
  }

  private get declarationCertificateRepository() {
    return this.sequelize.getRepository(DeclarationCertificate); // Assuming EnglishCertificate is also a TranscriptRequest
  }
  async createDeclarationCertificateRequest(createDeclarationRequestDto: CreateDeclarationRequestDto) {
    try {
      const existingRequest = await this.englishCertificateRepository.findOne({
        where: { regnumber: createDeclarationRequestDto.regnumber, status: 'PENDING' },
      });
      if (existingRequest) {
        throw new BadRequestException('Sorry you still have pending request.');
      }


      return await this.declarationCertificateRepository.create({
        ...createDeclarationRequestDto,
        libraryStatus: 'PENDING',
        financeStatus: 'PENDING',
        welfareStatus: 'PENDING',
      } as DeclarationCertificate);
    } catch (error) {
      throw new BadRequestException(`Failed to create declation certificate request: ${error.message}`);
    }
  }
  private get declarationChangesRepository() {
    return this.sequelize.getRepository(DeclarationChanges); // Assuming EnglishChanges is also a TranscriptRequest
  }

  private get declarationProofOfPaymentRepository() {
    return this.sequelize.getRepository(DeclarationProofOfPayment); // Assuming EnglishChanges is also a TranscriptRequest
  }
  async createChangesOnDeclarationCertificateRequest(createDeclarationChangeDto: CreateDeclarationChangeDto) {
    try {
      const englishCertificateRequest = await this.declarationCertificateRepository.findByPk(createDeclarationChangeDto.requestId);
      if (!englishCertificateRequest) {
        throw new BadRequestException(`declation certificate request with ID #${createDeclarationChangeDto.requestId} not found.`);
      }

      const declarationChange = await this.declarationChangesRepository.create({
        ...createDeclarationChangeDto,

      } as DeclarationChanges);

      if (!declarationChange) {
        throw new BadRequestException(`Failed to create changes on declation certificate request.`);
      }
      // Update the request status based on the changes
      if (createDeclarationChangeDto.from === 'LIBRARY') {
        englishCertificateRequest.set('libraryStatus', 'WAITING_PAYMENT');
      }
      if (createDeclarationChangeDto.from === 'FINANCE') {
        englishCertificateRequest.set('financeStatus', 'WAITING_PAYMENT');
      }
      if (createDeclarationChangeDto.from === 'WELFARE') {
        englishCertificateRequest.set('welfareStatus', 'WAITING_PAYMENT');
      }
      await englishCertificateRequest.save();
      return declarationChange;
    } catch (error) {
      throw new BadRequestException(`Failed to create changes on declation certificate request: ${error.message}`);
    }
  }
  async findAllDeclarationRequest(querry) {
    return this.declarationCertificateRepository.findAll({ where: querry }
    );
  }
  async findOneDeclarationRequest(id: number) {
    const declationRequest = await this.declarationCertificateRepository.findByPk(id, {
      include: [
        { model: this.declarationChangesRepository, as: 'declarationChanges', attributes: ['from', 'comment'] },
        { model: this.declarationProofOfPaymentRepository, as: 'declarationProofOfPayment', attributes: ['to', 'proofOfpaymentUrl'] },

      ],
    });
    if (!declationRequest) {
      throw new BadRequestException(`Declation request with ID #${id} not found.`);
    }
    return declationRequest;
  }

  async createProofOfPayment(id: number, createProofOfPaymentDto: CreateDeclarationProofOfPaymentDto) {
    try {
      const declationRequest = await this.declarationCertificateRepository.findByPk(id);
      if (!declationRequest) {
        throw new BadRequestException(`Declation request with ID #${id} not found.`);
      }
      createProofOfPaymentDto.requestId = id;
      const requestId = createProofOfPaymentDto.requestId;
      const proofOfPayment = await this.declarationProofOfPaymentRepository.create({
        ...createProofOfPaymentDto,
        requestId
      } as DeclarationProofOfPayment);
      return proofOfPayment;
    } catch (error) {
      throw new BadRequestException(`Failed to create proof of payment: ${error.message}`);
    }
  }

  async updateDeclarationRequestLibrary(id: number, updateDocumentRequestDto: UpdateDeclarationRequestLibraryDto) {
    const declationRequest = await this.declarationCertificateRepository.findByPk(id);
    if (!declationRequest) {
      throw new BadRequestException(`Declation request with ID #${id} not found.`);
    }
    updateDocumentRequestDto.libraryStatus = 'APPROVED'
    declationRequest.set('libraryStatus', 'APPROVED');
    await declationRequest.update(updateDocumentRequestDto);
    return declationRequest;
  }

  async updateDeclarationRequestFinance(id: number, updateDocumentRequestDto: UpdateDeclarationRequestFinanceDto) {
    const declationRequest = await this.declarationCertificateRepository.findByPk(id);
    if (!declationRequest) {
      throw new BadRequestException(`Declation request with ID #${id} not found.`);
    }
    updateDocumentRequestDto.financeStatus = 'APPROVED'
    declationRequest.set('financeStatus', 'APPROVED');
    await declationRequest.update(updateDocumentRequestDto);
    return declationRequest;
  }
  async updateDeclarationRequestWelfare(id: number, updateDocumentRequestDto: UpdateDeclarationRequestWelfareDto) {
    const declationRequest = await this.declarationCertificateRepository.findByPk(id);
    if (!declationRequest) {
      throw new BadRequestException(`Declation request with ID #${id} not found.`);
    }
    updateDocumentRequestDto.welfareStatus = 'APPROVED'
    declationRequest.set('welfareStatus', 'APPROVED');
    await declationRequest.update(updateDocumentRequestDto);
    return declationRequest;
  }
}
