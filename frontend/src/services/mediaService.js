// frontend/src/services/mediaService.js
import api from './api';

export const fetchMedia = async () => {
  const data = await api('/media');
  return data.items || [];
};

export const uploadMedia = async ({ file, title, description, uploaderId }) => {
  if (!file) throw new Error('No file selected');
  const formData = new FormData();
  formData.append('media', file);
  formData.append('title', title || 'Untitled');
  formData.append('description', description || '');
  formData.append('uploaderAccountId', uploaderId);

  return api('/upload', {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const viewMedia = async ({ mediaId, viewerAccountId }) => {
  return api('/view', {
    method: 'POST',
    body: JSON.stringify({ mediaId, viewerAccountId }),
  });
};

export const deleteMedia = async (mediaId) => {
  return api('/media', {
    method: 'DELETE',
    body: JSON.stringify({ mediaId }),
  });
};

export const updateMedia = async (mediaId, updates) => {
  return api(`/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};