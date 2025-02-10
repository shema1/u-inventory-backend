import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('fetch-html')
  @ApiOperation({ summary: 'Fetch HTML from a given URL' })
  @ApiQuery({
    name: 'url',
    required: true,
    description: 'The URL to fetch HTML from',
  })
  @ApiResponse({ status: 200, description: 'Returns HTML content' })
  @ApiResponse({ status: 400, description: 'URL is required' })
  @ApiResponse({ status: 500, description: 'Failed to fetch HTML' })
  async fetchHtml(@Query('url') url: string): Promise<string> {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(url);
      return response.data; // Повертаємо HTML-код
    } catch {
      throw new HttpException(
        'Failed to fetch HTML',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
