// stores/gateway.ts
import { writable } from "svelte/store";
import { SecurityStep } from "../enum";


interface IGatewayState {
  steps: SecurityStep[];
  sharedData: Record<string, any>;
  currentStepIndex: number;
  emailAuthentication: Record<string, any>;
  passwordProtection: Record<string, any>;
  photoAndLocationCapture: Record<string, any>;
}

const initialState: IGatewayState = {
  steps: [],
  sharedData: {},
  currentStepIndex: 0,
  emailAuthentication: {},
  passwordProtection: {},
  photoAndLocationCapture: {},
};

function createGatewayStore() {
  const { subscribe, update, set } = writable<IGatewayState>(initialState);

  return {
    subscribe,
    setSteps: (payload: Omit<IGatewayState, "currentStepIndex">) =>
      set({ ...payload, currentStepIndex: 0 }),
    completeStep: () =>
      update((state) => ({
        ...state,
        currentStepIndex: state.currentStepIndex + 1,
      })),
    reset: () => set(initialState),
  };
}

export const gatewayStore = createGatewayStore();
