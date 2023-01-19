import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { StationService } from './station.service';
import { Station, StationSchema } from './schemas/station.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost/db-application'),
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [AppController],
  providers: [StationService],
})
export class AppModule {}
