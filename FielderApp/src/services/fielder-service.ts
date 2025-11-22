import { API_BASE_URL } from '../config/api';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

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

export async function createActivityEntryFromCamera(
  activityUuid: string,
  token: string,
  data: { body?: string; data?: any; photo?: string; photoName?: string }
): Promise<ActivityEntryDto> {
  console.log('createActivityEntryFromCamera payload:', { 
    body: data.body, 
    data: data.data, 
    hasPhoto: !!data.photo,
    photoName: data.photoName 
  });
  
  const formData = new FormData();
  if (data.body) formData.append('body', data.body);
  if (data.data) formData.append('data', JSON.stringify(data.data));
  if (data.photo) formData.append('photo', data.photo);
  if (data.photoName) formData.append('photoName', data.photoName);

  const res = await fetch(`${API_BASE_URL}/api/activities/${activityUuid}/entries/camera`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  console.log('createActivityEntryFromCamera response status:', res.status);
  if (!res.ok) {
    const err = await res.json();
    console.error('createActivityEntryFromCamera error response:', JSON.stringify(err, null, 2));
    throw new Error(err.message || 'Failed to create activity entry from camera');
  }

  const text = await res.text();
  console.log('createActivityEntryFromCamera raw response:', text);
  const json: { data: ActivityEntryDto } = JSON.parse(text);
  console.log('createActivityEntryFromCamera success:', json);
  return json.data;
}

export async function createActivityEntry(
  activityUuid: string,
  token: string,
  data: { body?: string; data?: any; attachments?: DocumentPicker.DocumentPickerAsset[] }
): Promise<ActivityEntryDto> {
  console.log('createActivityEntry payload:', { body: data.body, data: data.data, attachmentsCount: data.attachments?.length });
  const formData = new FormData();
  if (data.body) formData.append('body', data.body);
  if (data.data) formData.append('data', JSON.stringify(data.data));

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((asset, index) => {
      console.log(`Appending attachment ${index}:`, { uri: asset.uri, type: asset.mimeType, name: asset.name });
      
      // Use the original working format
      formData.append('attachments[]', {
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
      Accept: 'application/json',
      // Do NOT set Content-Type for FormData; let the browser set it with boundary
    },
    body: formData,
  });

  console.log('createActivityEntry response status:', res.status);
  if (!res.ok) {
    const err = await res.json();
    console.error('createActivityEntry error response:', JSON.stringify(err, null, 2));
    throw new Error(err.message || 'Failed to create activity entry');
  }

  const text = await res.text();
  console.log('createActivityEntry raw response:', text);
  const json: { data: ActivityEntryDto } = JSON.parse(text);
  console.log('createActivityEntry success:', json);
  return json.data;
}

export async function fetchActivityEntry(entryUuid: string, token: string): Promise<ActivityEntryDto> {
  const res = await fetch(`${API_BASE_URL}/api/entries/${entryUuid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load activity entry');
  }

  const json: { data: ActivityEntryDto } = await res.json();
  return json.data;
}

export async function updateActivityEntry(
  entryUuid: string,
  token: string,
  data: { body?: string | null; data?: any }
): Promise<ActivityEntryDto> {
  const res = await fetch(`${API_BASE_URL}/api/entries/${entryUuid}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update activity entry');
  }

  const json: { data: ActivityEntryDto } = await res.json();
  return json.data;
}

export async function deleteActivityEntry(entryUuid: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/entries/${entryUuid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete activity entry');
  }
}

export async function deleteActivityEntryAttachment(entryUuid: string, attachmentUuid: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/entries/${entryUuid}/attachments/${attachmentUuid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete attachment');
  }
}
