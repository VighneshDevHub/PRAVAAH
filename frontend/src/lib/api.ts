import { Job, Session, Finding, Recommendation } from './types';

const API_BASE = '/api/v1';

export async function signupApi(username: string, email: string, password: string, role = 'analyst') {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(errorData.detail || 'Registration failed');
  }
  const data = await res.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user_info', JSON.stringify(data.user_info));
  }
  return data;
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
    throw new Error(errorData.detail || 'Invalid username or password');
  }
  const data = await res.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user_info', JSON.stringify(data.user_info));
  }
  return data;
}

export function logoutApi() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}

export function getStoredUser() {
  if (typeof window !== 'undefined') {
    const info = localStorage.getItem('user_info');
    if (info) {
      try { return JSON.parse(info); } catch (e) { return null; }
    }
  }
  return null;
}

export async function uploadPcap(file: File): Promise<Job> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/jobs/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errorData.detail || 'Failed to upload PCAP');
  }

  return res.json();
}

export async function triggerSamplePcap(sampleName: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/sample/${sampleName}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Sample trigger failed' }));
    throw new Error(errorData.detail || 'Failed to trigger sample PCAP');
  }

  return res.json();
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function getJob(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
}

export async function getJobSessions(jobId: string): Promise<Session[]> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getFindings(jobId?: string, severity?: string): Promise<Finding[]> {
  const params = new URLSearchParams();
  if (jobId) params.append('job_id', jobId);
  if (severity) params.append('severity', severity);

  const res = await fetch(`${API_BASE}/findings?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch findings');
  return res.json();
}

export async function getRecommendations(jobId: string): Promise<Recommendation[]> {
  const res = await fetch(`${API_BASE}/findings/recommendations/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}
