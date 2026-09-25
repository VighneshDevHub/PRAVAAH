import { useEffect, useState } from 'react';
import { Job } from '../lib/types';

export function useJobSocket(jobId: string | null) {
  const [job, setJob] = useState<Partial<Job> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    const defaultWsHost = isProd ? 'pravaah-l166.onrender.com' : window.location.host;
    const protocol = window.location.protocol === 'https:' || isProd ? 'wss:' : 'ws:';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
      ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/jobs/${jobId}`
      : `${protocol}//${defaultWsHost}/ws/jobs/${jobId}`;
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
