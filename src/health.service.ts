import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async checkDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      return { db: 'up' };
    } catch (error) {
      return { db: 'down', error: error.message };
    }
  }

  async performHealthCheck() {
    const db = await this.checkDatabase();

    return {
      status: db.db === 'up' ? 'healthy' : 'degraded',
      uptime: process.uptime(),
      db,
      timestamp: new Date().toISOString(),
    };
  }
}
