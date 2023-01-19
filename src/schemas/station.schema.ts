import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema()
export class Station {
  @Prop()
  id: number;
  @Prop()
  ds100: string[];
  @Prop()
  ifopt: string;
  @Prop()
  name: string;
  @Prop()
  traffic: string;
  @Prop({
    type: {
      latitude: Number,
      longitude: Number,
    },
  })
  position: {
    latitude: number;
    longitude: number;
  };
  @Prop({
    type: {
      id: Number,
      name: String,
    },
  })
  operator: {
    id: number;
    name: string;
  };
  @Prop()
  status: string;
}

export const StationSchema = new mongoose.Schema({
  id: Number,
  ds100: [String],
  ifopt: String,
  name: String,
  traffic: String,
  position: {
    latitude: Number,
    longitude: Number,
  },
  operator: {
    id: Number,
    name: String,
  },
  status: String
});
