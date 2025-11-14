import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as pkg from '../package.json';
import { HealthService } from './health.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'API Info',
    description: 'API metadata for service discovery and diagnostics.',
  })
  @ApiOkResponse({
    description: 'API information.',
  })
  getInfo() {
    return {
      status: 'ok',
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      environment: process.env.NODE_ENV ?? 'development',
      buildNumber: process.env.BUILD_NUMBER ?? null,
      commitHash: process.env.COMMIT_HASH ?? null,
      timestamp: new Date().toISOString(),
      docs: '/api/docs',
      health: '/health',
    };
  }

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({
    summary: 'Full System Health Check',
    description:
      'Performs DB connectivity, uptime, cache health, and overall service evaluation.',
  })
  @ApiOkResponse({
    description: 'Detailed system health.',
  })
  async getHealth() {
    return this.healthService.performHealthCheck();
  }
}
