import { create } from 'zustand';

const useHeadersStore = create((set, get) => ({
  // State
  contentType: 'application/json',
  authEnabled: false,
  authType: 'Bearer',
  authValue: '',

  // Actions
  setContentType: (contentType) => set({ contentType }),
  setAuthEnabled: (authEnabled) => set({ authEnabled }),
  setAuthType: (authType) => set({ authType }),
  setAuthValue: (authValue) => set({ authValue }),

  // Computed
  buildHeaders: () => {
    const state = get();
    const headersObj = {};

    // Always include Content-Type
    headersObj["Content-Type"] = state.contentType;

    // Include Authorization if enabled and has value
    if (state.authEnabled && state.authValue.trim()) {
      headersObj["Authorization"] = `${state.authType} ${state.authValue}`;
    }

    return headersObj;
  },

  // Reset
  reset: () => set({
    contentType: 'application/json',
    authEnabled: false,
    authType: 'Bearer',
    authValue: ''
  })
}));

export default useHeadersStore;