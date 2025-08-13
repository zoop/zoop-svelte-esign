// src/lib/utils/mixpanel.ts
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';
const IS_PROD = import.meta.env.VITE_ENV === 'production';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export const initMixpanel = (): Promise<void> => {
  if (typeof window === 'undefined' || isInitialized || !MIXPANEL_TOKEN) {
    return Promise.resolve();
  }

  if (!initPromise) {
    initPromise = new Promise<void>((resolve) => {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: !IS_PROD,
        persistence: 'localStorage',
        autotrack: true
      });
      isInitialized = true;
      resolve();
    });
  }

  return initPromise;
};

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export const identifyUser = async (userId: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  await initMixpanel();
  mixpanel.identify(userId);
  mixpanel.people.set('user_id', userId);
  mixpanel.register({ user_id: userId });
};

export const setUserProperties = async (
  properties: EventProperties
): Promise<void> => {
  if (typeof window === 'undefined') return;
  await initMixpanel();
  mixpanel.people.set(properties);
};

export const setGlobalProperties = async (
  properties: EventProperties
): Promise<void> => {
  if (typeof window === 'undefined') return;
  await initMixpanel();
  mixpanel.register(properties);
};

export const trackEvent = async (
  event: string,
  properties?: EventProperties
): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;
    await initMixpanel();
    mixpanel.track(event, properties);
  } catch (err) {
    console.error('[MIXPANEL] Failed to track event:', err);
  }
};

export const resetMixpanel = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  await initMixpanel();
  mixpanel.reset();
};
