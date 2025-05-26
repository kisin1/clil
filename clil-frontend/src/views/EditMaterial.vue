<template>
  <div>
    <v-toolbar density="compact" flat class="mb-4">
       <v-btn icon @click="router.push('/materials')">
           <v-icon>mdi-arrow-left</v-icon>
       </v-btn>
        <v-toolbar-title class="text-h6">
            <span v-if="material">{{ material.title || 'Material bearbeiten' }}</span>
            <v-skeleton-loader v-else type="text" width="200"></v-skeleton-loader>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip size="small" class="mr-2" :color="saveStatusColor" variant="tonal">
          <v-icon start size="small">{{ saveStatusIcon }}</v-icon>
          {{ saveStatusText }}
        </v-chip>
        <!-- Weitere Aktionen wie Export, Teilen könnten hierhin -->
        <v-btn color="primary" @click="forceSave">
            <v-icon start>mdi-content-save</v-icon>
            Speichern
        </v-btn>
        <v-btn color="info" variant="text" @click="handlePreview">
          <v-icon start>mdi-eye</v-icon>
          Vorschau
        </v-btn>
        <v-btn color="secondary" @click="handleExport">
          <v-icon start>mdi-export</v-icon>
          Exportieren
        </v-btn>
    </v-toolbar>

    <v-row>
      <!-- Haupt-Editor-Bereich -->
      <v-col cols="12" md="8">
          <v-skeleton-loader v-if="loading" type="image, article"></v-skeleton-loader>
          <material-editor
            v-else-if="material"
            v-model="editableContent"
            @save-status="updateSaveStatus"
            :language-level="editableLanguageLevel"
            :vocab-percentage="editableVocabPercentage"
            :enable-clil-tools="true"
          />
          <v-alert v-else type="error">
              Material konnte nicht geladen werden.
          </v-alert>
      </v-col>

      <!-- Sidebar für Metadaten -->
      <v-col cols="12" md="4">
        <v-card elevation="1" v-if="material">
           <v-card-title class="text-subtitle-1">Metadaten</v-card-title>
           <v-divider></v-divider>
           <v-card-text>
              <v-text-field
                v-model="editableTitle"
                label="Titel"
                variant="outlined"
                density="compact"
                class="mb-3"
                @input="markUnsaved"
                @blur="saveTitle"
              ></v-text-field>
              <v-select
                v-model="editableType"
                :items="materialTypes"
                item-title="title"
                item-value="id"
                label="Material-Typ"
                variant="outlined"
                density="compact"
                class="mb-3"
                @update:modelValue="saveMetadata('type', editableType)"
              ></v-select>
               <v-select
                v-model="editableSubject"
                :items="subjects"
                label="Fach"
                variant="outlined"
                density="compact"
                class="mb-3"
                @update:modelValue="saveMetadata('subject', editableSubject)"
              ></v-select>

               <v-divider class="my-3"></v-divider>
                <h4 class="text-subtitle-2 mb-2">CLIL-Parameter</h4>
               <v-select
                  v-model="editableLanguageLevel"
                  :items="languageLevels"
                  label="Sprachniveau"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                   @update:modelValue="saveMetadata('language.level', editableLanguageLevel)"
                ></v-select>
                <v-slider
                    v-model="editableVocabPercentage"
                    :min="10"
                    :max="50"
                    :step="5"
                    label="Fachvokabular (%)"
                    color="primary"
                    thumb-label
                    class="mb-1"
                    @update:modelValue="saveMetadata('language.vocabPercentage', editableVocabPercentage)"
                >
                    <template v-slot:append>
                        <v-chip size="small" label>{{ editableVocabPercentage }}%</v-chip>
                    </template>
                </v-slider>

               <v-divider class="my-3"></v-divider>
                <div class="text-caption">
                    Erstellt: {{ formatDate(material.created) }}
                </div>
                <div class="text-caption">
                    Zuletzt geändert: {{ formatDate(material.modified) }}
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn block variant="text" @click="showVersionHistory = true">
                  <v-icon start>mdi-history</v-icon>
                  Änderungsverlauf anzeigen
                </v-btn>
           </v-card-text>
           <v-divider></v-divider>
           <v-card-actions>
               <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="confirmDeleteDialog = true">
                   <v-icon start>mdi-delete-outline</v-icon>
                   Löschen
               </v-btn>
           </v-card-actions>
        </v-card>
         <v-skeleton-loader v-else type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

     <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Löschen bestätigen</v-card-title>
        <v-card-text>
          Sind Sie sicher, dass Sie dieses Material endgültig löschen möchten?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="confirmDeleteDialog = false">Abbrechen</v-btn>
          <v-btn color="error" @click="deleteMaterial" :loading="deleting">Löschen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ExportDialog
      v-model="exportDialog"
      :material="material"
      :metadata="{
        type: editableType,
        subject: editableSubject,
        languageLevel: editableLanguageLevel,
        vocabPercentage: editableVocabPercentage
      }"
    />
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-dialog v-model="showPreview" fullscreen>
      <v-card>
        <v-toolbar density="compact">
          <v-btn icon @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Vorschau: {{ editableTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showPreview = false">
            Zurück zum Bearbeiten
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="preview-content" v-html="editableContent"></div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMaterialsStore } from '@/stores/materials';
import { useUIStore } from '@/stores/ui';
import MaterialEditor from '@/components/Editor/MaterialEditor.vue';
import ExportDialog from '@/components/ExportDialog.vue';
import {
  getIconForType,
  getIconColor,
  getMaterialTypeTitle,
  formatDate,
  MATERIAL_TYPES
} from '@/utils/materialUtils';

const route = useRoute();
const router = useRouter();
const materialsStore = useMaterialsStore();
const uiStore = useUIStore();

const loading = ref(true);
const material = ref(null);
const editableContent = ref('');
const editableTitle = ref('');
const editableType = ref('');
const editableSubject = ref('');
const editableLanguageLevel = ref('B1');
const editableVocabPercentage = ref(30);
const editableTags = ref([]);
const availableTags = ref(['CLIL', 'Technik', 'Quiz', 'Glossar', 'Präsentation', 'Video']);
const saveStatus = ref('saved');
const confirmDeleteDialog = ref(false);
const deleting = ref(false);
const titleSaveTimeout = ref(null);
const contentSaveTimeout = ref(null);
const exportDialog = ref(false);
const showPreview = ref(false);
const showVersionHistory = ref(false);
const snackbar = ref({ show: false, text: '', color: 'success' });

// Globale Materialtypen aus Utils
const materialTypes = computed(() =>
  Object.entries(MATERIAL_TYPES).map(([id, config]) => ({ id, title: config.title }))
);
const subjects = [
  'Informatik', 'Elektrotechnik', 'Maschinenbau', 'Mechatronik', 'Netzwerktechnik', 'Elektronik', 'Datenbanken', 'Webentwicklung', 'Mathematik', 'Physik'
];
const languageLevels = [
  { title: 'A1', value: 'A1' }, { title: 'A2', value: 'A2' }, { title: 'B1', value: 'B1' }, { title: 'B2', value: 'B2' }, { title: 'C1', value: 'C1' }
];

// Material laden
onMounted(async () => {
  loading.value = true;
  const materialId = route.params.id;
  material.value = materialsStore.getMaterialById(materialId);
  if (!material.value) {
    console.warn(`Material with ID ${materialId} not found in store.`);
  }
  if(material.value) {
      editableContent.value = material.value.content || '';
      editableTitle.value = material.value.title || '';
      editableType.value = material.value.type || '';
      editableSubject.value = material.value.subject || '';
      editableLanguageLevel.value = material.value.language?.level || 'B1';
      editableVocabPercentage.value = material.value.language?.vocabPercentage || 30;
      editableTags.value = material.value.tags || [];
  }
  loading.value = false;
});

// Save-Status-Logik
const updateSaveStatus = (status) => {
  saveStatus.value = status;
};
const saveStatusText = computed(() => {
    switch(saveStatus.value) {
        case 'saved': return 'Gespeichert';
        case 'unsaved': return 'Ungespeichert';
        case 'saving': return 'Speichern...';
        case 'error': return 'Fehler';
        default: return ''
    }
});
const saveStatusIcon = computed(() => {
     switch(saveStatus.value) {
        case 'saved': return 'mdi-check-circle-outline';
        case 'unsaved': return 'mdi-alert-circle-outline';
        case 'saving': return 'mdi-sync';
        case 'error': return 'mdi-close-circle-outline';
        default: return ''
    }
});
const saveStatusColor = computed(() => {
     switch(saveStatus.value) {
        case 'saved': return 'success';
        case 'unsaved': return 'warning';
        case 'saving': return 'info';
        case 'error': return 'error';
        default: return 'grey'
    }
});

const markUnsaved = () => {
    if (saveStatus.value === 'saved') {
        saveStatus.value = 'unsaved';
    }
}

const saveMetadata = async (field, value) => {
    if (!material.value) return;
    markUnsaved();
    saveStatus.value = 'saving';
    try {
        let updateData = { id: material.value.id };
        if (field.startsWith('language.')) {
            const langField = field.split('.')[1];
            updateData.language = { ...material.value.language, [langField]: value };
        } else {
            updateData[field] = value;
        }
        await materialsStore.updateMaterial(updateData);
        if (field.startsWith('language.')) {
             const langField = field.split('.')[1];
             if (material.value.language) material.value.language[langField] = value;
        } else {
            material.value[field] = value;
        }
        saveStatus.value = 'saved';
        showFeedback('Metadaten gespeichert', 'success');
        if (field !== 'tags') uiStore.setLastEditedMaterial(material.value.id);
    } catch (error) {
        console.error(`Error saving metadata field ${field}:`, error);
        saveStatus.value = 'error';
        showFeedback('Fehler beim Speichern!', 'error');
    }
};

// Debounced Title-Save
const saveTitle = () => {
    if (titleSaveTimeout.value) clearTimeout(titleSaveTimeout.value);
    titleSaveTimeout.value = setTimeout(() => {
        if (material.value && editableTitle.value !== material.value.title) {
            saveMetadata('title', editableTitle.value);
        }
    }, 800);
};
watch(editableTitle, () => {
    markUnsaved();
    if (titleSaveTimeout.value) clearTimeout(titleSaveTimeout.value);
    titleSaveTimeout.value = setTimeout(saveTitle, 1500);
});

// Auto-Save für Editor-Inhalt
const saveContent = async () => {
  if (material.value && editableContent.value !== material.value.content) {
    saveStatus.value = 'saving';
    try {
      await materialsStore.updateMaterial({
        id: material.value.id,
        content: editableContent.value
      });
      material.value.content = editableContent.value;
      saveStatus.value = 'saved';
      showFeedback('Inhalt gespeichert', 'success');
      uiStore.setLastEditedMaterial(material.value.id);
    } catch (error) {
      console.error('Error auto-saving content:', error);
      saveStatus.value = 'error';
      showFeedback('Fehler beim automatischen Speichern!', 'error');
    }
  }
};
watch(editableContent, () => {
  markUnsaved();
  if (contentSaveTimeout.value) clearTimeout(contentSaveTimeout.value);
  contentSaveTimeout.value = setTimeout(saveContent, 2000);
});

// Export-Dialog
const handleExport = () => {
  exportDialog.value = true;
};

// Vorschau
const handlePreview = () => {
  showPreview.value = true;
};

// Snackbar Feedback
const showFeedback = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

// Force Save
const forceSave = async () => {
    if (!material.value) return;
    saveStatus.value = 'saving';
    try {
        await materialsStore.updateMaterial({
            id: material.value.id,
            content: editableContent.value,
            title: editableTitle.value,
            tags: editableTags.value
        });
        saveStatus.value = 'saved';
        showFeedback('Material gespeichert', 'success');
        uiStore.setLastEditedMaterial(material.value.id);
    } catch (error) {
        console.error('Error force saving:', error);
        saveStatus.value = 'error';
        showFeedback('Fehler beim Speichern!', 'error');
    }
}

// Delete
const deleteMaterial = async () => {
  if (!material.value) return;
  deleting.value = true;
  try {
    await materialsStore.deleteMaterial(material.value.id);
    confirmDeleteDialog.value = false;
    router.push('/materials');
  } catch (error) {
    console.error('Error deleting material:', error);
    showFeedback('Fehler beim Löschen!', 'error');
  } finally {
    deleting.value = false;
  }
};

</script>

<style scoped>
/* Add specific styles for the edit view if needed */
.v-toolbar-title {
    flex: 0 1 auto; /* Prevent title from shrinking too much */
    min-width: 150px;
}
</style> 