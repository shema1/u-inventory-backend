import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from 'src/schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  // Create
  async create(itemDto: Partial<Item>): Promise<Item> {
    const newItem = new this.itemModel(itemDto);
    return newItem.save();
  }

  // Read all
  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  // Read one
  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  // Update
  async update(id: string, updateDto: Partial<Item>): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateDto, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  // Delete
  async remove(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }
}
