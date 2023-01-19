import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coordinate } from 'tsgeo/Coordinate';
import { Haversine } from 'tsgeo/Distance/Haversine';
import { StationDTO } from './dtos/station.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DistanceDTO } from './dtos/distance.dto';
import { Station, StationDocument } from './schemas/station.schema';

@Injectable()
export class StationService {
  constructor(
    @InjectModel(Station.name) private stationModel: Model<StationDocument>,
  ) {
    this.stationModel.collection.drop().then(
      () => this.saveStations()
    );
  }

  async saveStations(): Promise<void> {
    const csvFilePath = path.resolve('./data.CSV');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const fileLines: string[] = fileContent.split('\n').slice(1);
    fileLines.pop();
    await this.stationModel.insertMany(
      fileLines
        .map((row: string) => row.split(';'))
        .map(this.parseRowToStation),
    );
  }

  parseRowToStation(row: string[]): StationDTO {
    return {
      id: +row[0],
      ds100: row[1].split(','),
      ifopt: row[2],
      name: row[3],
      traffic: row[4],
      position: {
        latitude: +row[5].replace(',', '.'),
        longitude: +row[6].replace(',', '.'),
      },
      status: row[9],
      operator: {
        id: +row[8],
        name: row[7],
      }
    };
  }

  async findFVStationByDS100(ds100: string): Promise<StationDTO> {
    const station = await this.stationModel.findOne({ ds100: { $elemMatch: { $eq: ds100 } } });
    if (!station)
      throw new HttpException(`Station ${ds100} does not exist!`, HttpStatus.NOT_FOUND);
    if (!station.traffic.includes('FV'))
      throw new HttpException(`Station ${ds100} is no FV train station!`, HttpStatus.BAD_REQUEST);
    return station;
  }

  calculateDistance(fromStation: StationDTO, toStation: StationDTO): number {
    return new Haversine().getDistance(
      new Coordinate(
        toStation.position.longitude,
        toStation.position.latitude,
      ),
      new Coordinate(
        fromStation.position.longitude,
        fromStation.position.latitude,
      ),
    ) / 1000;
  }

  async getDistance(from: string, to: string): Promise<DistanceDTO> {
    if (from == to)
      throw new HttpException('Both stations are equal!', HttpStatus.BAD_REQUEST);
    const fromStation = await this.findFVStationByDS100(from);
    const toStation = await this.findFVStationByDS100(to);
    const distance = Math.round(this.calculateDistance(fromStation, toStation));

    return {
      from: fromStation.name,
      to: toStation.name,
      distance: distance,
      unit: 'km'
    };
  }
}
