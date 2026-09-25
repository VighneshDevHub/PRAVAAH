import { useEffect, useState } from 'react';
import { Job } from '../lib/types';

export function useJobSocket(jobId: string | null) {
  const [job, setJob] = useState<Partial<Job> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/jobs/${jobId}`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setJob((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [jobId]);

  return job;
}
