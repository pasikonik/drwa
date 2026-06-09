import { createDirectus, rest } from '@directus/sdk';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Tworzymy klienta Directus z obsługą REST API
  const directus = createDirectus(config.public.directusUrl).with(rest());

  return {
    provide: {
      directus
    }
  };
});