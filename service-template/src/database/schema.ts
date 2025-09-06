import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).unique().notNull(),
  role: varchar('role', { enum: ['member', 'manager', 'admin'] }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// sprints
export const sprints = pgTable('sprints', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  goal: text('goal'),
  status: varchar('status'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// statuses
export const statuses = pgTable('statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: varchar('business_id').notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }),
});

// priorities
export const priorities = pgTable('priorities', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: varchar('business_id').notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  level: integer('level').notNull(),
});

// user_stories
export const userStories = pgTable('user_stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  sprintId: uuid('sprint_id').references(() => sprints.id),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  statusId: uuid('status_id').references(() => statuses.id),
  priorityId: uuid('priority_id').references(() => priorities.id),
  point: integer('point').notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// tasks
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userStoryId: uuid('user_story_id').references(() => userStories.id),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  statusId: uuid('status_id').references(() => statuses.id),
  priorityId: uuid('priority_id').references(() => priorities.id),
  dueDate: date('due_date'),
  estimateHours: integer('estimate_hours'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// labels
export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }),
});

// task_labels
export const taskLabels = pgTable(
  'task_labels',
  {
    taskId: uuid('task_id').references(() => tasks.id),
    labelId: uuid('label_id').references(() => labels.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.labelId] }),
  }),
);

// story_labels
export const storyLabels = pgTable(
  'story_labels',
  {
    storyId: uuid('story_id').references(() => userStories.id),
    labelId: uuid('label_id').references(() => labels.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.storyId, table.labelId] }),
  }),
);

// comments (can be for task or story)
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  taskId: uuid('task_id').references(() => tasks.id),
  storyId: uuid('story_id').references(() => userStories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// attachments
export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileUrl: varchar('file_url', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  taskId: uuid('task_id').references(() => tasks.id),
  storyId: uuid('story_id').references(() => userStories.id),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});
