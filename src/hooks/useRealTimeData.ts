import { useState, useEffect } from 'react';
import { dataIngestionService } from '../services/DataIngestionService';
import { Trace } from '../types';

export function useRealTimeData() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Start real-time data ingestion
    if (isLive) {
      dataIngestionService.startIngestion();
    } else {
      dataIngestionService.stopIngestion();
    }

    // Subscribe to new traces
    const unsubscribe = dataIngestionService.subscribe((newTrace) => {
      setTraces(prev => [newTrace, ...prev].slice(0, 100)); // Keep last 100 traces
    });

    return () => {
      unsubscribe();
      dataIngestionService.stopIngestion();
    };
  }, [isLive]);

  const toggleLive = () => setIsLive(!isLive);

  return {
    traces,
    isLive,
    toggleLive,
  };
}
