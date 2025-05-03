import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Apply validation pipe
   app.useGlobalPipes(new ValidationPipe());
  
   // Apply global exception filter
   app.useGlobalFilters(new HttpExceptionFilter());
  

   // Swagger Configuration
   const config = new DocumentBuilder()
   .setTitle('UNIDOC REQUEST SYSTEM API')           // API Title
   .setDescription('API documentation for the UNIDOC REQUEST SYSTEM')  // Description
   .setVersion('1.0')                          // API Version
   .addBearerAuth()                             // Enable JWT Bearer Authentication
   .build();

 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api/docs', app, document); // Swagger UI endpoint: /api/docs

  await app.listen(process.env.PORT ?? 7000);
  console.log('🚀 Server running on http://localhost:7000');
  console.log('📚 Swagger UI: http://localhost:7000/api/docs');
}
bootstrap();
