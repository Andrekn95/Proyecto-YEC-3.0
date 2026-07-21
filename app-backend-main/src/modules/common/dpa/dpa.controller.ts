import { Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterface } from '@utils/interfaces';
import { DpaService } from '@modules/common/dpa/dpa.service';
import { PublicRoute } from '@auth/decorators';

@ApiTags('DPA')
@Controller('common/dpa')
export class DpaController {
  constructor(private service: DpaService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Find Cache' })
  @Get('cache')
  @HttpCode(HttpStatus.OK)
  async findCache(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findCache();

    return {
      data: serviceResponse,
      message: `Cache de Catalogos`,
      title: `Cache`,
    };
  }

  @ApiOperation({ summary: 'Load Cache' })
  @Patch('cache')
  @HttpCode(HttpStatus.OK)
  async loadCache(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.loadCache();
    return {
      data: serviceResponse,
      message: `Load Cache de Catalogos`,
      title: `Load Cache`,
    };
  }
}
