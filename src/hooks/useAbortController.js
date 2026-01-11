// AbortController Hook
// Following Phoenix pattern for request cancellation

import { useRef, useEffect } from 'react';

/**
 * AbortController hook
 * Creates and manages AbortController for API requests
 * Automatically aborts on unmount
 *
 * @returns {React.MutableRefObject<AbortController>} - AbortController ref
 */
const useAbortController = () => {
  const abortContRef = useRef(new AbortController());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortContRef.current) {
        abortContRef.current.abort();
      }
    };
  }, []);

  return abortContRef;
};

export default useAbortController;
