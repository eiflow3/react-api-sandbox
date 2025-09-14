import { create } from 'zustand';

const useApiConfigStore = create((set) => ({
  // State
  endpoint: '',
  method: 'GET',
  payload: '',

  // Actions
  setEndpoint: (endpoint) => set({ endpoint }),
  setMethod: (method) => set({ method }),
  setPayload: (payload) => set({ payload }),

  // Reset
  reset: () => set({
    endpoint: '',
    method: 'GET',
    payload: ''
  })
}));

export default useApiConfigStore;