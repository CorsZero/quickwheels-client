/**
 * Quick Wheel Vehicle Rental App
 * Page: API Testing (Postman-like for TanStack Query)
 * Description: Testing page for all API endpoints and queries
 * Tech: React + TypeScript + TanStack Query
 */

import { useState } from 'react';
import { 
  useVehicles, 
  useVehicleById, 
  useMyListings,
  useCreateVehicle,
  useUpdateVehicle,
  useUpdateVehicleStatus,
  useRemoveVehicle
} from '../../bff/queries/vehicle.queries';
import {
  useBookingDetails,
  useMyRentals,
  useAvailability,
  useCreateBooking,
  useApproveBooking,
  useRejectBooking,
  useCancelBooking,
  useStartRental,
  useCompleteRental,
} from '../../bff/queries/booking.queries';
import {
  fetchVehicles,
  fetchVehicleById,
  fetchMyListings,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  removeVehicle,
} from '../../bff/api/vehicle.api';
import {
  createBooking,
  fetchBookingDetails,
  fetchMyRentals,
  fetchMyRequests,
  checkAvailability,
  approveBooking,
  rejectBooking,
  cancelBooking,
  startRental,
  completeRental,
} from '../../bff/api/booking.api';
import styles from './ApiTesting.module.css';

const ApiTesting = () => {
  // Call all imported query hooks
  const vehiclesQuery = useVehicles();
  const vehicleByIdQuery = useVehicleById("");
  const myListingsQuery = useMyListings(1, 10);
  
  // Booking query hooks
  const bookingDetailsQuery = useBookingDetails("");
  const myRentalsQuery = useMyRentals(undefined, 1, 10);
  const availabilityQuery = useAvailability("", "", "");
  
  // Mutation hooks
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const updateVehicleStatusMutation = useUpdateVehicleStatus();
  const removeVehicleMutation = useRemoveVehicle();
  
  // Booking mutation hooks
  const createBookingMutation = useCreateBooking();
  const approveBookingMutation = useApproveBooking();
  const rejectBookingMutation = useRejectBooking();
  const cancelBookingMutation = useCancelBooking();
  const startRentalMutation = useStartRental();
  const completeRentalMutation = useCompleteRental();
  
  // State
  const [queryName, setQueryName] = useState('useVehicles');
  const [requestBody, setRequestBody] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [response, setResponse] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: any;
    error?: string;
    errorDetails?: any;
    statusCode?: number;
    timestamp?: string;
    duration?: number;
  }>({ status: 'idle' });
  
  // Registry mapping query names to their actual hooks
  const queryRegistry: Record<string, {
    query?: any;
    mutation?: any;
    description: string;
    requiresBody: boolean;
    requiresParams?: boolean;
    bodyTemplate?: string;
    paramsTemplate?: string;
    isMutation?: boolean;
  }> = {
    useVehicles: {
      query: vehiclesQuery,
      description: 'GET /vehicles - Fetch all vehicles from vehicle-service',
      requiresBody: false,
      requiresParams: false,
      isMutation: false,
    },
    useVehicleById: {
      query: vehicleByIdQuery,
      description: 'GET /vehicles/{id} - Fetch a vehicle by ID',
      requiresBody: false,
      requiresParams: true,
      paramsTemplate: '{\n  "vehicleId": "215e9c09-532e-4d87-bff6-e972900ef40e"\n}',
      isMutation: false,
    },
    useMyListings: {
      query: myListingsQuery,
      description: 'GET /vehicles/my-listings - Fetch user\'s vehicle listings (requires auth)',
      requiresBody: false,
      requiresParams: true,
      paramsTemplate: '{\n  "page": 1,\n  "limit": 10\n}',
      isMutation: false,
    },
    useCreateVehicle: {
      mutation: createVehicleMutation,
      description: 'POST /vehicles - Create a new vehicle listing (requires auth)',
      requiresBody: true,
      requiresParams: false,
      isMutation: true,
      bodyTemplate: '{\n  "make": "Toyota",\n  "model": "Camry",\n  "year": 2022,\n  "pricePerDay": 50,\n  "location": "Colombo",\n  "availability": true\n}',
    },
    useUpdateVehicle: {
      mutation: updateVehicleMutation,
      description: 'PUT /vehicles/{id} - Update a vehicle listing (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "vehicleId": "vehicle-id-here"\n}',
      bodyTemplate: '{\n  "make": "Toyota",\n  "model": "Camry",\n  "year": 2023,\n  "pricePerDay": 55,\n  "location": "Colombo"\n}',
    },
    useUpdateVehicleStatus: {
      mutation: updateVehicleStatusMutation,
      description: 'PATCH /vehicles/{id}/status - Update vehicle status (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "vehicleId": "vehicle-id-here"\n}',
      bodyTemplate: '{\n  "availability": false\n}',
    },
    useRemoveVehicle: {
      mutation: removeVehicleMutation,
      description: 'PATCH /vehicles/{id}/remove - Remove/delete a vehicle (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "vehicleId": "vehicle-id-here"\n}',
      bodyTemplate: '{\n  "reason": "No longer available"\n}',
    },
    useCreateBooking: {
      mutation: createBookingMutation,
      description: 'POST /bookings - Create a new booking (requires auth)',
      requiresBody: true,
      requiresParams: false,
      isMutation: true,
      bodyTemplate: '{\n  "vehicleId": "vehicle-id-here",\n  "startDate": "2025-01-15T10:00:00Z",\n  "endDate": "2025-01-20T10:00:00Z"\n}',
    },
    useBookingDetails: {
      query: bookingDetailsQuery,
      description: 'GET /bookings/{id} - Fetch booking details (requires auth)',
      requiresBody: false,
      requiresParams: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
      isMutation: false,
    },
    useMyRentals: {
      query: myRentalsQuery,
      description: 'GET /bookings/my-rentals - Fetch user\'s rentals (requires auth)',
      requiresBody: false,
      requiresParams: true,
      paramsTemplate: '{\n  "status": "active",\n  "page": 1,\n  "limit": 10\n}',
      isMutation: false,
    },
    useMyRequests: {
      query: myRentalsQuery,
      description: 'POST /bookings/my-requests - Fetch booking requests for owner (requires auth)',
      requiresBody: true,
      requiresParams: false,
      isMutation: false,
      bodyTemplate: '{\n  "ownerVehicleIds": ["vehicle-id-1", "vehicle-id-2"]\n}',
    },
    useAvailability: {
      query: availabilityQuery,
      description: 'GET /bookings/availability/{vehicleId} - Check vehicle availability',
      requiresBody: false,
      requiresParams: true,
      paramsTemplate: '{\n  "vehicleId": "vehicle-id-here",\n  "startDate": "2025-01-15T10:00:00Z",\n  "endDate": "2025-01-20T10:00:00Z"\n}',
      isMutation: false,
    },
    useApproveBooking: {
      mutation: approveBookingMutation,
      description: 'PATCH /bookings/{id}/approve - Approve a booking (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
      bodyTemplate: '{\n  "ownerVehicleIds": ["vehicle-id-1"]\n}',
    },
    useRejectBooking: {
      mutation: rejectBookingMutation,
      description: 'PATCH /bookings/{id}/reject - Reject a booking (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
      bodyTemplate: '{\n  "reason": "Vehicle not available",\n  "ownerVehicleIds": ["vehicle-id-1"]\n}',
    },
    useCancelBooking: {
      mutation: cancelBookingMutation,
      description: 'PATCH /bookings/{id}/cancel - Cancel a booking (requires auth)',
      requiresBody: false,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
    },
    useStartRental: {
      mutation: startRentalMutation,
      description: 'PATCH /bookings/{id}/start - Start a rental (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
      bodyTemplate: '{\n  "ownerVehicleIds": ["vehicle-id-1"]\n}',
    },
    useCompleteRental: {
      mutation: completeRentalMutation,
      description: 'PATCH /bookings/{id}/complete - Complete a rental (requires auth)',
      requiresBody: true,
      requiresParams: true,
      isMutation: true,
      paramsTemplate: '{\n  "bookingId": "booking-id-here"\n}',
      bodyTemplate: '{\n  "ownerVehicleIds": ["vehicle-id-1"],\n  "finalPrice": 250\n}',
    },
  };

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
    if (query?.paramsTemplate) {
      setQueryParams(query.paramsTemplate);
    } else {
      setQueryParams('');
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
      let data;
      
      if (selectedQuery.isMutation) {
        // For mutations, parse request body and call API functions directly
        if (selectedQuery.requiresBody && !requestBody.trim()) {
          setResponse({
            status: 'error',
            error: 'Request body is required for mutations',
            timestamp: new Date().toLocaleTimeString(),
            duration: 0,
          });
          return;
        }

        const parsedBody = requestBody.trim() ? JSON.parse(requestBody) : {};

        if (queryName === 'useCreateVehicle') {
          data = await createVehicle(parsedBody);
        } else if (queryName === 'useUpdateVehicle') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const vehicleId = params.vehicleId;
          if (!vehicleId) {
            setResponse({
              status: 'error',
              error: 'vehicleId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await updateVehicle(vehicleId, parsedBody);
        } else if (queryName === 'useUpdateVehicleStatus') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const vehicleId = params.vehicleId;
          if (!vehicleId) {
            setResponse({
              status: 'error',
              error: 'vehicleId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await updateVehicleStatus(vehicleId, parsedBody);
        } else if (queryName === 'useRemoveVehicle') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const vehicleId = params.vehicleId;
          if (!vehicleId) {
            setResponse({
              status: 'error',
              error: 'vehicleId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await removeVehicle(vehicleId, parsedBody);
        } else if (queryName === 'useCreateBooking') {
          data = await createBooking(parsedBody);
        } else if (queryName === 'useApproveBooking') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await approveBooking(bookingId, parsedBody);
        } else if (queryName === 'useRejectBooking') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await rejectBooking(bookingId, parsedBody);
        } else if (queryName === 'useCancelBooking') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await cancelBooking(bookingId);
        } else if (queryName === 'useStartRental') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await startRental(bookingId, parsedBody);
        } else if (queryName === 'useCompleteRental') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await completeRental(bookingId, parsedBody);
        } else {
          // Fallback to mutateAsync
          data = await selectedQuery.mutation.mutateAsync(parsedBody);
        }
        
        const duration = Math.round(performance.now() - startTime);
        setResponse({
          status: 'success',
          data: data,
          timestamp: new Date().toLocaleTimeString(),
          duration,
        });
      } else {
        // For queries, call API functions directly to support dynamic params
        if (queryName === 'useVehicles') {
          data = await fetchVehicles();
        } else if (queryName === 'useVehicleById') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const vehicleId = params.vehicleId || '215e9c09-532e-4d87-bff6-e972900ef40e';
          data = await fetchVehicleById(vehicleId);
        } else if (queryName === 'useMyListings') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const page = params.page || 1;
          const limit = params.limit || 10;
          data = await fetchMyListings(page, limit);
        } else if (queryName === 'useBookingDetails') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const bookingId = params.bookingId;
          if (!bookingId) {
            setResponse({
              status: 'error',
              error: 'bookingId is required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await fetchBookingDetails(bookingId);
        } else if (queryName === 'useMyRentals') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const status = params.status;
          const page = params.page || 1;
          const limit = params.limit || 10;
          data = await fetchMyRentals(status, page, limit);
        } else if (queryName === 'useMyRequests') {
          if (!requestBody.trim()) {
            setResponse({
              status: 'error',
              error: 'Request body is required for my-requests',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          const parsedBody = JSON.parse(requestBody);
          data = await fetchMyRequests(parsedBody);
        } else if (queryName === 'useAvailability') {
          const params = queryParams.trim() ? JSON.parse(queryParams) : {};
          const vehicleId = params.vehicleId;
          const startDate = params.startDate;
          const endDate = params.endDate;
          if (!vehicleId || !startDate || !endDate) {
            setResponse({
              status: 'error',
              error: 'vehicleId, startDate, and endDate are required in query parameters',
              timestamp: new Date().toLocaleTimeString(),
              duration: 0,
            });
            return;
          }
          data = await checkAvailability(vehicleId, startDate, endDate);
        } else {
          // Fallback to refetch for other queries
          const result = await selectedQuery.query.refetch();
          data = result.data;
        }
        
        const duration = Math.round(performance.now() - startTime);
        setResponse({
          status: 'success',
          data: data,
          timestamp: new Date().toLocaleTimeString(),
          duration,
        });
      }
    } catch (error: any) {
      const duration = Math.round(performance.now() - startTime);
      setResponse({
        status: 'error',
        error: error.message || 'Unknown error occurred',
        errorDetails: error.serverResponse || error.response?.data || error,
        statusCode: error.statusCode || error.response?.status,
        timestamp: new Date().toLocaleTimeString(),
        duration,
      });
    }
  };

  const handleClear = () => {
    setResponse({ status: 'idle' });
    setRequestBody('');
    setQueryParams('');
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
              <span className={styles.queryKey}>
                {selectedQuery.isMutation ? (
                  <>Type: Mutation | Status: {selectedQuery.mutation.status}</>
                ) : (
                  <>
                    Status: {selectedQuery.query.status} | 
                    Fetching: {selectedQuery.query.isFetching ? 'Yes' : 'No'}
                  </>
                )}
              </span>
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
              Query Parameters (JSON)
              {selectedQuery?.requiresParams && <span className={styles.required}>*optional</span>}
            </label>
            <textarea
              value={queryParams}
              onChange={(e) => setQueryParams(e.target.value)}
              placeholder={selectedQuery?.paramsTemplate || '{\n  "param": "value"\n}'}
              className={styles.bodyInput}
              rows={4}
            />
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
                <span>❌ Error {response.statusCode && `(${response.statusCode})`}</span>
                {response.timestamp && <span className={styles.timestamp}>{response.timestamp}</span>}
              </div>
              <div>
                <strong>Message:</strong>
                <pre className={styles.errorMessage}>{response.error}</pre>
              </div>
              {response.errorDetails && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Server Response:</strong>
                  <pre className={styles.errorMessage}>
                    {JSON.stringify(response.errorDetails, null, 2)}
                  </pre>
                </div>
              )}
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
