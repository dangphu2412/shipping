import { ZodObject } from 'zod/v4';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export const ZodDataTransformPipe = (model: ZodObject<any>): PipeTransform => ({
  transform(value: any) {
    const result = model.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return result.data;
  },
});
