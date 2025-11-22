// Shared enums and types for projects and activities.
// This is the single source of truth for project/activity types and
// the structure of the `details` JSON blobs used across the app.

// Project types: one table, discriminated by `type`.
export const PROJECT_TYPES = {
  BASIC: 'basic',
  RND: 'rnd',
} as const;

export type ProjectType = (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES];

// Activity types: one table, discriminated by `type`.
export const ACTIVITY_TYPES = {
  CORE: 'core',
  SUPPORTING: 'supporting',
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

// --- Project details ---

export interface ProjectObjective {
  id: string;
  text: string;
  status: 'open' | 'in_progress' | 'done';
}

export interface ProjectMetric {
  key: string;
  label: string;
  target?: string;
  current?: string;
}

export interface BaseProjectDetails {
  description?: string;
  tags?: string[];
  ownerUserId?: string; // reference to users.id
}

export interface BasicProjectDetails extends BaseProjectDetails {
  // For now, no extra fields beyond the base.
}

export interface RndProjectDetails extends BaseProjectDetails {
  hypothesis?: string;
  objectives?: ProjectObjective[];
  metrics?: ProjectMetric[];
  successCriteria?: string;
}

export type ProjectDetails =
  | ({ type: typeof PROJECT_TYPES.BASIC } & BasicProjectDetails)
  | ({ type: typeof PROJECT_TYPES.RND } & RndProjectDetails);

// --- Activity details ---

export interface BaseActivityDetails {
  description?: string;
  assigneeUserId?: string; // reference to users.id
  estimateHours?: number;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface ExperimentActivityDetails extends BaseActivityDetails {
  kind: 'experiment';
  linkedObjectiveIds?: string[]; // references ProjectObjective.id
  experimentPlan?: string;
  resultSummary?: string;
  evidenceLinks?: string[];
}

export interface TaskActivityDetails extends BaseActivityDetails {
  kind?: 'task';
}

export type ActivityDetails =
  | ExperimentActivityDetails
  | TaskActivityDetails;
