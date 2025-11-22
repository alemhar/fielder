import { API_BASE_URL } from '../config/api';

export type ProjectSummary = {
  uuid: string;
  title: string;
  details: Record<string, unknown> | null;
  details_schema: Record<string, unknown> | null;
  external_id: string | null;
  activities_count: number;
};

export type ActivitySummary = {
  uuid: string;
  title: string;
  type: string | null;
  details: Record<string, unknown> | null;
  details_schema: Record<string, unknown> | null;
  external_id: string | null;
};

export type ActivityEntryAttachment = {
  uuid: string;
  original_name: string | null;
  mime_type: string | null;
  size: number | null;
  meta: Record<string, unknown> | null;
  url?: string;
};

export type ActivityEntryDto = {
  uuid: string;
  body: string | null;
  data: Record<string, unknown> | null;
  created_at: string | null;
  user: { id: string; email: string } | null;
  attachments: ActivityEntryAttachment[];
};

export const fetchProjects = async (token: string): Promise<ProjectSummary[]> => {
  const res = await fetch(`${API_BASE_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load projects');
  }

  const json = await res.json();
  return json.data as ProjectSummary[];
};

export const fetchProjectActivities = async (
  projectUuid: string,
  token: string,
): Promise<ActivitySummary[]> => {
  const res = await fetch(`${API_BASE_URL}/api/projects/${projectUuid}/activities`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load activities');
  }

  const json = await res.json();
  return json.data as ActivitySummary[];
};

export const fetchActivityEntries = async (
  activityUuid: string,
  token: string,
): Promise<ActivityEntryDto[]> => {
  const res = await fetch(`${API_BASE_URL}/api/activities/${activityUuid}/entries`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load activity entries');
  }

  const json = await res.json();
  return json.data as ActivityEntryDto[];
};

export async function createActivityEntry(
  activityUuid: string,
  token: string,
  data: { body?: string; data?: any; attachments?: DocumentPicker.DocumentPickerAsset[] }
): Promise<ActivityEntryDto> {
  const formData = new FormData();
  if (data.body) formData.append('body', data.body);
  if (data.data) formData.append('data', JSON.stringify(data.data));

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((asset, index) => {
      formData.append(`attachments[${index}]`, {
        uri: asset.uri,
        type: asset.mimeType || 'application/octet-stream',
        name: asset.name,
      } as any);
    });
  }

  const res = await fetch(`${API_BASE_URL}/api/activities/${activityUuid}/entries`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type for FormData; let the browser set it with boundary
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create activity entry');
  }

  const json: { data: ActivityEntryDto } = await res.json();
  return json.data;
}
