import { Module } from '@nestjs/common';
import { DocumentRequestService } from './document-request.service';
import { DeclationCertificateRequestController, DocumentRequestController, EnglishCertificateRequestController, TranscriptRequestController } from './document-request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RecommendationLetter } from './entities/recomandation-letter.entity';
import { TranscriptRequest } from './entities/transcript-request.entity';
import { TranscriptChanges } from './entities/transcript-changes.entity';
import { EnglishCertificate } from './entities/english-certificate.entity';
import { EnglishChanges } from './entities/english-changes.entity';
import { DeclarationCertificate } from './entities/declaration-certificate.entity';
import { DeclarationProofOfPayment } from './entities/declaration-proof-of-payment.entity';
import { DeclarationChanges } from './entities/declaration-changes.entity';
import { JwtService } from '@nestjs/jwt';
import { Transcript } from './entities/transcripts-marks.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [SequelizeModule.forFeature([
      RecommendationLetter,
       TranscriptRequest,
        TranscriptChanges,
        EnglishCertificate,
        EnglishChanges,
        DeclarationCertificate,
        DeclarationChanges,
        DeclarationProofOfPayment,
        Transcript
    ])],
  controllers: [DocumentRequestController, TranscriptRequestController, EnglishCertificateRequestController, DeclationCertificateRequestController],
  providers: [DocumentRequestService, JwtService, MailService],
})
export class DocumentRequestModule {}
