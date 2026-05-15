import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export const handleDBExceptions = (error: any, logger: Logger): never => {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  logger.error(error);
  throw new InternalServerErrorException(
    'Error inesperado, revisar logs del servidor',
  );
};
