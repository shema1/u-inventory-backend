import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class ItemMetrics {
  @Prop({ required: true })
  commonValueStartPeriod: number;

  @Prop({ required: true })
  arrived: number;

  @Prop({ required: true })
  departed: number;

  @Prop({ required: true })
  commonValueEndPeriod: number;
}

export const ItemMetricsSchema = SchemaFactory.createForClass(ItemMetrics);

@Schema()
export class Item {
  @Prop({ type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() })
  id: Types.ObjectId;

  @Prop()
  itemId: string;

  // Назва
  @Prop()
  itemName: string;

  @Prop()
  ownerName: string;

  // Властивості вартості
  @Prop({ type: ItemMetricsSchema })
  cost: ItemMetrics;

  // Властивості амортизації
  @Prop({ type: ItemMetricsSchema })
  depreciation: ItemMetrics;

  // Кількість товару
  @Prop({ type: ItemMetricsSchema })
  quantity: ItemMetrics;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
