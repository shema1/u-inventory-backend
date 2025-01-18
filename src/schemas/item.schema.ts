import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class ItemMetrics {
  @Prop({ required: true })
  commonValueStartPeriod: number;

  @Prop({ required: true })
  arrived: number;

  @Prop({ required: true })
  Departed: number;

  @Prop({ required: true })
  commonValueEndPeriod: number;
}

@Schema()
export class Item {
  @Prop()
  itemId: string;

  // Назва
  @Prop()
  itemName: string;

  @Prop()
  ownerName: string;

  // Властивості вартості
  cost: ItemMetrics;

  // Властивості амортизації
  depreciation: ItemMetrics;

  // Кількість товару
  quantity: ItemMetrics;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
