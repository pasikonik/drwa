<template>
  <div style="font-family: sans-serif; padding: 2rem;">
    <h1>Projekt: DRWA 🪓</h1>
    <p>Status połączenia z Directus:</p>
    
    <div v-if="serverInfo">
      <p style="color: green; font-weight: bold;">✅ Połączono pomyślnie z Dockerem!</p>
      <pre style="background: #f4f4f4; padding: 1rem; border-radius: 5px;">{{ serverInfo }}</pre>
    </div>
    
    <div v-else-if="error">
      <p style="color: red; font-weight: bold;">❌ Błąd połączenia sieciowego:</p>
      <pre style="background: #fff0f0; color: red; padding: 1rem; border-radius: 5px;">{{ error }}</pre>
    </div>
    
    <p v-else>Łączenie z backendem...</p>
  </div>
</template>

<script setup>
const { $directus } = useNuxtApp();

const { data: serverInfo, error } = await useAsyncData('serverHealth', () => 
  $directus.request(() => ({
    method: 'GET',
    path: '/server/info',
  }))
);
</script>