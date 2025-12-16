<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VendorForm from './components/VendorForm.vue';
import VendorList from './components/VendorList.vue';

const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  isDark.value = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
};

const toggleTheme = () => {
  applyTheme(!isDark.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Default to system preference if no saved theme
    applyTheme(true);
  }
});
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1>Trusted Vendor Portal</h1>
        <p class="subtitle">Management System</p>
      </div>
      <button @click="toggleTheme" class="theme-toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '🌞 Light' : '🌙 Dark' }}
      </button>
    </header>
    <main>
      <div class="content-layout">
        <section class="form-section">
          <VendorForm />
        </section>
        <section class="list-section">
          <VendorList />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.header-content h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0;
  font-size: 0.9em;
  color: var(--color-text);
  opacity: 0.6;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 1024px) {
  .content-layout {
    grid-template-columns: 350px 1fr; /* Fixed width form, flexible list */
    gap: var(--spacing-xl);
    align-items: start;
  }
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
}

.theme-toggle:hover {
  background-color: var(--color-card-bg);
  border-color: var(--color-primary);
}

@media (min-width: 768px) {
  .header-content h1 {
    font-size: 1.8rem;
  }
}
</style>
