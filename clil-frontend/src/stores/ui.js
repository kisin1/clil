import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  // State
  const lastCreatedMaterial = ref(null);
  const currentTheme = ref('light');
  const sidebarExpanded = ref(true);

  // Actions
  function setLastCreatedMaterial(materialId) {
    lastCreatedMaterial.value = materialId;
  }

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  }

  function toggleSidebar() {
    sidebarExpanded.value = !sidebarExpanded.value;
  }

  return {
    // State
    lastCreatedMaterial,
    currentTheme,
    sidebarExpanded,
    
    // Actions
    setLastCreatedMaterial,
    toggleTheme,
    toggleSidebar
  };
}); 