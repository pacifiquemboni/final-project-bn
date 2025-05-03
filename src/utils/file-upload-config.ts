import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadConfig {
  static getOptions(
    uploadPath = './uploads', // Default path
    allowedTypes = [
      // Images
      'image/png',
      'image/jpeg',
      'image/jpg',
      // 'image/gif',
      // 'image/bmp',
      // 'image/webp',
      // 'image/tiff',
      // 'image/svg+xml',
      // 'image/x-icon',

      // Documents
      'application/pdf', // PDFs
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.ms-excel', // XLS
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'text/csv', // CSV
      // 'application/xml', // XML
      // 'application/json', // JSON
      // 'text/plain', // TXT
      // 'application/rtf', // RTF (Rich Text Format)

      // Presentations
      'application/vnd.ms-powerpoint', // PPT
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX

      // Archives
      // 'application/zip', // ZIP
      // 'application/x-rar-compressed', // RAR
      // 'application/x-tar', // TAR
      // 'application/gzip', // GZIP

      // // Audio
      // 'audio/mpeg', // MP3
      // 'audio/wav', // WAV
      // 'audio/ogg', // OGG

      // // Video
      // 'video/mp4', // MP4
      // 'video/x-msvideo', // AVI
      // 'video/mpeg', // MPEG
      // 'video/quicktime', // MOV
    ],
    maxSizeMB = 5, // Default size: 5MB
  ): MulterOptions {
    // Ensure the upload directory exists, if not, create it
    const uploadDirectory = path.resolve(uploadPath);
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true }); // Create the directory if it doesn't exist
      console.log(`Directory created: ${uploadDirectory}`);
    }

    return {
      storage: diskStorage({
        destination: uploadDirectory,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.random().toString(36).substring(2, 8);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: {
        fileSize: maxSizeMB * 1024 * 1024, // Convert MB to Bytes
      },
      fileFilter: (req, file, callback) => {
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    };
  }
}
/*
usage
   @UseInterceptors(FileInterceptor('file', FileUploadConfig.getOptions()))
   @UseInterceptors(FilesInterceptor('files', 10, FileUploadConfig.getOptions()))
    @UseInterceptors(AnyFilesInterceptor(FileUploadConfig.getOptions()))
*/
