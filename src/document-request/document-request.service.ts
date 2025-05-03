import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecomandationRequestDto, UpdateRecomandationRequestDto, UpdateRecomandationRequestStaffDto } from './dto/create-recomandation.dto';
import { UpdateDocumentRequestDto } from './dto/update-document-request.dto';
import { Sequelize } from 'sequelize-typescript';
import { RecommendationLetter } from './entities/recomandation-letter.entity';
import { CreateTranscriptChangesDto, CreateTranscriptRequestDto, UpdateTranscriptRequestDto } from './dto/create-transcript-request.dto';
import { TranscriptRequest } from './entities/transcript-request.entity';
import { TranscriptChanges } from './entities/transcript-changes.entity';
import { CreateEnglishCertificateChangesDto, CreateEnglishCertificateDto, UpdateEnglishCertificateRequestDto, UpdateEnglishCertificateRequestStaffDto } from './dto/create-english-certificate.dto';
import { EnglishCertificate } from './entities/english-certificate.entity';
import { EnglishChanges } from './entities/english-changes.entity';
import { CreateDeclarationChangeDto, CreateDeclarationProofOfPaymentDto, CreateDeclarationRequestDto, UpdateDeclarationRequestFinanceDto, UpdateDeclarationRequestLibraryDto, UpdateDeclarationRequestWelfareDto } from './dto/create-decration-request.dto';
import { DeclarationCertificate } from './entities/declaration-certificate.entity';
import { DeclarationChanges } from './entities/declaration-changes.entity';
import { DeclarationProofOfPayment } from './entities/declaration-proof-of-payment.entity';

@Injectable()
export class DocumentRequestService {
  constructor(
    private readonly sequelize: Sequelize,
  ) { }
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
    return this.recomendationLetterRepository.findAll({ where: querry });
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
        where: { regnumber: createTranscriptRequestDto.regnumber, status: 'PENDING' },
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
  async findAllTranscriptRequest(querry) {
    return this.transcriptRequestRepository.findAll({ where: querry }
    );
  }

  async findOneRequest(id: number) {
    const transcriptRequest = await this.transcriptRequestRepository.findByPk(id, {
      include: [
        { model: this.transcriptChangesRepository, as: 'transcriptChanges' },
      ],
    });
    if (!transcriptRequest) {
      throw new BadRequestException(`Transcript request with ID #${id} not found.`);
    }
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
        { model: this.englishChangesRepository, as: 'englishChanges', attributes: [ 'comment'] },
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
        { model: this.declarationProofOfPaymentRepository, as: 'declarationProofOfPayment', attributes: ['to','proofOfpaymentUrl'] },

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
