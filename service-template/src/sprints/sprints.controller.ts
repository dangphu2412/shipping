import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { z } from 'zod/v4';
import { ZodDataTransformPipe } from '../shared/data-transform/zod-data-transform.pipe';

const createUserStoryDto = z.object({
  name: z.string(),
  goal: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});
export type CreateSprintDto = z.infer<typeof createUserStoryDto>;

const updateUserStoryDto = z.object({
  id: z.string(),
  name: z.string(),
  goal: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});
export type UpdateSprintDto = z.infer<typeof updateUserStoryDto>;

@Controller('sprints')
export class SprintsController {
  constructor(private readonly userStoriesService: SprintsService) {}

  @Post()
  create(
    @Body(ZodDataTransformPipe(createUserStoryDto))
    createUserStoryDto: CreateSprintDto,
  ) {
    return this.userStoriesService.create(createUserStoryDto);
  }

  @Get()
  find() {
    return this.userStoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ZodDataTransformPipe(updateUserStoryDto))
    updateUserStoryDto: UpdateSprintDto,
  ) {
    return this.userStoriesService.update(id, updateUserStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStoriesService.remove(id);
  }
}
