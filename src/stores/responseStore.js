import { create } from 'zustand';

const useResponseStore = create((set) => ({
  // State
  response: null,
  error: null,
  isSuccess: false,
  // Separate states for each method
  nativeFetchError: null,
  nativeFetchSuccess: false,
  reactQueryError: null,
  reactQuerySuccess: false,

  // Actions
  setResponse: (response) => {
    console.log("Store setResponse called with:", response);
    const newState = { response, error: null, isSuccess: true };
    console.log("Store setResponse new state:", newState);
    return set(newState);
  },
  setError: (error) => {
    console.log("Store setError called with:", error);
    const newState = { error, response: null, isSuccess: false };
    console.log("Store setError new state:", newState);
    return set(newState);
  },
  
  // Native Fetch specific actions
  setNativeFetchError: (error) => {
    console.log("Store setNativeFetchError called with:", error);
    return set({ nativeFetchError: error, nativeFetchSuccess: false });
  },
  setNativeFetchSuccess: (success) => {
    console.log("Store setNativeFetchSuccess called with:", success);
    return set({ nativeFetchSuccess: success, nativeFetchError: null });
  },
  
  // React Query specific actions
  setReactQueryError: (error) => {
    console.log("Store setReactQueryError called with:", error);
    return set({ reactQueryError: error, reactQuerySuccess: false });
  },
  setReactQuerySuccess: (success) => {
    console.log("Store setReactQuerySuccess called with:", success);
    return set({ reactQuerySuccess: success, reactQueryError: null });
  },
  
  clearResponse: () => set({ response: null, isSuccess: false }),
  clearError: () => set({ error: null }),

  // Reset
  reset: () => set({
    response: null,
    error: null,
    isSuccess: false,
    nativeFetchError: null,
    nativeFetchSuccess: false,
    reactQueryError: null,
    reactQuerySuccess: false
  })
}));

export default useResponseStore;