import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useMaterialsStore = defineStore('materials', {
  state: () => ({
    materials: [
      {
        id: 'mat-001',
        title: 'Programmierung: Schleifen und Kontrollstrukturen',
        type: 'worksheet',
        created: '2025-04-24',
        modified: '2025-04-24',
        subject: 'Informatik',
        content: '<h1>Schleifen und Kontrollstrukturen</h1><p>Dies ist ein Beispielinhalt...</p>',
        language: {
          level: 'B1',
          vocabPercentage: 30
        },
        tags: ['programmierung', 'schleifen', 'kontrollstrukturen'],
        favorite: false
      },
      // Füge hier bei Bedarf weitere Mock-Materialien hinzu
      {
        id: 'mat-002',
        title: 'Datenbanken: SQL Grundlagen',
        type: 'quiz',
        created: '2025-04-20',
        modified: '2025-04-22',
        subject: 'Datenbanken',
        content: '<h2>SQL Quiz</h2><p>Frage 1...</p>',
        language: {
          level: 'A2',
          vocabPercentage: 20
        },
        tags: ['sql', 'datenbanken', 'quiz'],
        favorite: true
      },
    ],
    loading: false,
    error: null
  }),

  getters: {
    getMaterialById: (state) => (id) => {
      return state.materials.find(m => m.id === id) || null
    },

    sortedMaterials: (state) => {
      // Erstellt eine Kopie, bevor sortiert wird
      return [...state.materials].sort((a, b) =>
        new Date(b.modified) - new Date(a.modified)
      )
    },

    recentMaterials: (state) => {
       // Erstellt eine Kopie, bevor sortiert wird
      return [...state.materials]
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5)
    },

    materialsByType: (state) => {
      const grouped = {}
      state.materials.forEach(material => {
        if (!grouped[material.type]) {
          grouped[material.type] = []
        }
        grouped[material.type].push(material)
      })
      return grouped
    }
  },

  actions: {
    async fetchMaterials() {
      this.loading = true
      try {
        // Im Produktiveinsatz: API-Call
        // z.B. const response = await api.getMaterials()
        // Hier: Mock-Verzögerung
        await new Promise(resolve => setTimeout(resolve, 500))
        // Mock-Daten sind bereits im State vorhanden
        this.loading = false
      } catch (error) {
        this.error = 'Fehler beim Laden der Materialien'
        this.loading = false
        console.error(error)
      }
    },

    async addMaterial(materialData) {
      this.loading = true; // Ladezustand setzen
      try {
        const newMaterial = {
          id: `mat-${uuidv4().substring(0, 8)}`, // Kürzerer UUID
          created: new Date().toISOString().split('T')[0],
          modified: new Date().toISOString().split('T')[0],
          favorite: false,
          ...materialData
        }

        // Im Produktiveinsatz: API-Call
        // z.B. const savedMaterial = await api.createMaterial(newMaterial)
        await new Promise(resolve => setTimeout(resolve, 300)) // Simuliere API Call
        this.materials.unshift(newMaterial) // Füge vorne hinzu für Sichtbarkeit
        this.loading = false;
        return newMaterial
      } catch (error) {
        this.error = 'Fehler beim Erstellen des Materials'
        this.loading = false;
        console.error(error)
        throw error // Fehler weiterleiten für UI-Feedback
      }
    },

    async updateMaterial(materialData) {
      this.loading = true;
      try {
        const index = this.materials.findIndex(m => m.id === materialData.id)

        if (index === -1) {
          throw new Error('Material nicht gefunden')
        }

        const updatedMaterial = {
          ...this.materials[index],
          ...materialData,
          modified: new Date().toISOString().split('T')[0]
        }

        // Im Produktiveinsatz: API-Call
        // z.B. const savedMaterial = await api.updateMaterial(updatedMaterial)
        await new Promise(resolve => setTimeout(resolve, 300))
        this.materials[index] = updatedMaterial
        this.loading = false;
        return updatedMaterial
      } catch (error) {
        this.error = 'Fehler beim Aktualisieren des Materials'
        this.loading = false;
        console.error(error)
        throw error
      }
    },

    async deleteMaterial(id) {
      this.loading = true;
      try {
        // Im Produktiveinsatz: API-Call
        // z.B. await api.deleteMaterial(id)
        await new Promise(resolve => setTimeout(resolve, 300))
        this.materials = this.materials.filter(m => m.id !== id)
        this.loading = false;
      } catch (error) {
        this.error = 'Fehler beim Löschen des Materials'
        this.loading = false;
        console.error(error)
        throw error
      }
    },

    toggleFavorite(id) {
      const material = this.materials.find(m => m.id === id)
      if (material) {
        material.favorite = !material.favorite
        // Optional: Hier direkt ein Update anstoßen oder auf explizites Speichern warten
        // this.updateMaterial(material); // Beispiel: Direktes Speichern
      }
    }
  },

  // Optional: Persistenz mit pinia-plugin-persistedstate
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'clil-materials',
  //       storage: localStorage
  //     }
  //   ]
  // }
}) 