import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class StartSessionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  clientMetadata?: Record<string, any>;
}

export class CompleteSessionDto {
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsNumber()
  clientScore?: number;

  @IsOptional()
  gameplayEvents?: any;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
