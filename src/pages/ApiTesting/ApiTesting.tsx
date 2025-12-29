/**
 * Quick Wheel Vehicle Rental App
 * Page: API Testing (Postman-like for TanStack Query)
 * Description: Testing page for all API endpoints and queries
 * Tech: React + TypeScript + TanStack Query
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchVehicles } from '../../bff/api/vehicle.api';
import styles from './ApiTesting.module.css';

// Registry of available query functions
const queryRegistry: Record<string, {
  queryKey: string[];
  queryFn: (params?: any) => Promise<any>;
  description: string;
  requiresBody: boolean;
  bodyTemplate?: string;
}> = {
  useVehicles: {
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    description: 'Fetch all vehicles from vehicle-service',
    requiresBody: false,
  },
  // Add more queries here as you implement them
  // useVehicleById: {
  //   queryKey: ['vehicle'],
  //   queryFn: fetchVehicleById,
  //   description: 'Fetch a vehicle by ID',
  //   requiresBody: true,
  //   bodyTemplate: '{\n  "id": "vehicle-id-here"\n}',
  // },
};

const ApiTesting = () => {
  const queryClient = useQueryClient();
  
  const [queryName, setQueryName] = useState('useVehicles');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: any;
    error?: string;
    timestamp?: string;
    duration?: number;
  }>({ status: 'idle' });

  const availableQueries = Object.keys(queryRegistry);
  const selectedQuery = queryRegistry[queryName];

  const handleQuerySelect = (name: string) => {
    setQueryName(name);
    const query = queryRegistry[name];
    if (query?.bodyTemplate) {
      setRequestBody(query.bodyTemplate);
    } else {
      setRequestBody('');
    }
    setResponse({ status: 'idle' });
  };

  const handleSend = async () => {
    if (!selectedQuery) {
      setResponse({
        status: 'error',
        error: `Query "${queryName}" not found in registry`,
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    const startTime = performance.now();
    setResponse({ status: 'loading' });

    try {
      let params = undefined;
      if (requestBody.trim()) {
        try {
          params = JSON.parse(requestBody);
        } catch (e) {
          setResponse({
            status: 'error',
            error: 'Invalid JSON in request body',
            timestamp: new Date().toLocaleTimeString(),
          });
          return;
        }
      }

      const result = await queryClient.fetchQuery({
        queryKey: params ? [...selectedQuery.queryKey, params] : selectedQuery.queryKey,
        queryFn: () => selectedQuery.queryFn(params),
      });

      const duration = Math.round(performance.now() - startTime);

      setResponse({
        status: 'success',
        data: result,
        timestamp: new Date().toLocaleTimeString(),
        duration,
      });
    } catch (error: any) {
      const duration = Math.round(performance.now() - startTime);
      setResponse({
        status: 'error',
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toLocaleTimeString(),
        duration,
      });
    }
  };

  const handleClear = () => {
    setResponse({ status: 'idle' });
    setRequestBody('');
  };

  const copyToClipboard = () => {
    if (response.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔧 Query Tester</h1>
      </div>

      <div className={styles.mainContent}>
        {/* Left Panel - Request */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <h2>Request</h2>
          </div>

          <div className={styles.inputGroup}>
            <label>Query Function</label>
            <div className={styles.queryInputWrapper}>
              <input
                type="text"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="e.g., useVehicles"
                className={styles.queryInput}
                list="query-suggestions"
              />
              <datalist id="query-suggestions">
                {availableQueries.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          {selectedQuery && (
            <div className={styles.queryInfo}>
              <span className={styles.queryKey}>Key: {JSON.stringify(selectedQuery.queryKey)}</span>
              <p className={styles.queryDescription}>{selectedQuery.description}</p>
            </div>
          )}

          <div className={styles.availableQueries}>
            <label>Available Queries</label>
            <div className={styles.queryList}>
              {availableQueries.map((name) => (
                <button
                  key={name}
                  onClick={() => handleQuerySelect(name)}
                  className={`${styles.queryTag} ${queryName === name ? styles.active : ''}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Request Body (JSON)
              {selectedQuery?.requiresBody && <span className={styles.required}>*required</span>}
            </label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder={selectedQuery?.bodyTemplate || '{\n  "key": "value"\n}'}
              className={styles.bodyInput}
              rows={8}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={response.status === 'loading'}
            >
              {response.status === 'loading' ? '⏳ Sending...' : '🚀 Send Request'}
            </button>
            <button onClick={handleClear} className={styles.clearButton}>
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Right Panel - Response */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <h2>Response</h2>
            {response.status !== 'idle' && (
              <div className={styles.responseInfo}>
                {response.duration && (
                  <span className={styles.duration}>{response.duration}ms</span>
                )}
                <span className={`${styles.statusBadge} ${styles[response.status]}`}>
                  {response.status}
                </span>
              </div>
            )}
          </div>

          {response.status === 'idle' && (
            <div className={styles.emptyState}>
              <p>👈 Select a query and click Send to see the response</p>
            </div>
          )}

          {response.status === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Fetching data...</p>
            </div>
          )}

          {response.status === 'error' && (
            <div className={styles.errorState}>
              <div className={styles.errorHeader}>
                <span>❌ Error</span>
                {response.timestamp && <span className={styles.timestamp}>{response.timestamp}</span>}
              </div>
              <pre className={styles.errorMessage}>{response.error}</pre>
            </div>
          )}

          {response.status === 'success' && (
            <div className={styles.successState}>
              <div className={styles.successHeader}>
                <div>
                  <span>✅ Success</span>
                  {response.timestamp && <span className={styles.timestamp}>{response.timestamp}</span>}
                </div>
                <button onClick={copyToClipboard} className={styles.copyButton}>
                  📋 Copy
                </button>
              </div>
              <pre className={styles.jsonResponse}>
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTesting;
