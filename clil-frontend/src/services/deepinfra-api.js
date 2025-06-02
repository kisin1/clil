import axios from "axios";

// Configuration for Spring Boot backend
const API_CONFIG = {
  baseURL: "http://localhost:8080/api/v1/clil",
  timeout: 60000, // 60 seconds timeout for AI generation
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response?.status,
      error.response?.data || error.message
    );

    // Handle different error types
    if (error.response?.status === 404) {
      throw new Error("Backend service not available");
    } else if (error.response?.status === 500) {
      throw new Error("Server error occurred while generating content");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - content generation took too long");
    } else if (error.code === "ERR_NETWORK") {
      throw new Error("Cannot connect to backend server");
    }

    throw new Error(
      error.response?.data?.message || error.message || "Unknown error occurred"
    );
  }
);

const typeMap = {
  'worksheet': 'Arbeitsblatt',
  'quiz': 'Quiz',
  'glossary': 'Glossar',
  'presentation': 'Präsentation',
  'graphic': 'Grafik',
  'video': 'Video-Skript'
};

const reverseTypeMap = Object.fromEntries(
  Object.entries(typeMap).map(([key, value]) => [value, key])
);

export default {
  // Main method to generate lesson materials
  async generateMaterial(materialType, params = {}) {
    try {
      console.log(
        `Generating material: ${materialType} for topic: ${params.topic}`
      );

      // Request payload matching the Spring Boot MaterialRequest DTO
      const requestPayload = {
        materialType: typeMap[materialType] || materialType,
        topic: params.topic,
        prompt: params.prompt,
        subject: params.subject || '',
        languageLevel: params.languageLevel || 'B1',
        vocabPercentage: params.vocabPercentage || 30,
        contentFocus: params.contentFocus || 'balanced',
        includeVocabList: params.includeVocabList || true,
        description: params.description || ''
      };

      console.log('Sending request payload:', JSON.stringify(requestPayload, null, 2));

      // Call Spring Boot endpoint
      const response = await apiClient.post("/generate", requestPayload);

      // Transform response to match frontend expectations
      return {
        success: true,
        data: {
          title: params.topic,
          content:
            response.data.formattedResponse || "<p>No content generated</p>",
        },
        metadata: {
          generationTime: null, // Spring Boot doesn't return this yet
          tokensUsed: null, // Spring Boot doesn't return this yet
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        },
      };
    } catch (error) {
      console.error("Material generation error:", error.message);
      return {
        success: false,
        error: error.message,
        data: {
          title: "Error",
          content: `<div class="error-message">
            <h3>Content Generation Failed</h3>
            <p>${error.message}</p>
            <p>Please check your connection and try again.</p>
          </div>`,
        },
      };
    }
  },
  // Get all saved materials
  async getAllMaterials() {
    try {
      const response = await apiClient.get("/materials");
      return {
        success: true,
        data: response.data.map((material) => ({
          id: material.id,
          type: reverseTypeMap[material.materialType] || material.materialType?.toLowerCase() || '',
          title: material.topic,
          topic: material.topic,
          subject: material.subject || '',
          preview: material.aiResponse,
          content: material.aiResponse,
          createdAt: material.createdAt,
          created: material.createdAt,
          modified: material.modifiedAt || material.createdAt,
          tags: material.tags || []
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  // Get specific material by ID
  async getMaterial(id) {
    console.log('API Request: GET /materials/' + id);
    try {
      const response = await apiClient.get(`/materials/${id}`);
      console.log('API Response:', response.status, response.data);
      console.log('Raw API response:', response.data);
      
      // Transformiere die API-Antwort in das erwartete Format
      return {
        id: response.data.id,
        title: response.data.topic,
        content: response.data.formattedHtml || response.data.content,
        type: response.data.materialType,
        subject: response.data.subject || '',
        languageLevel: response.data.languageLevel || 'B1',
        vocabPercentage: response.data.vocabPercentage || 30,
        created: response.data.createdAt,
        modified: response.data.modifiedAt,
        tags: response.data.tags || []
      };
    } catch (error) {
      console.error('Error in getMaterial:', error);
      throw error;
    }
  },

  // Create new material
  async createMaterial(materialData) {
    try {
      console.log('[deepinfra-api] createMaterial sending to backend:', JSON.stringify(materialData, null, 2));
      const response = await apiClient.post("/materials", materialData);
      // Die Backend-Antwort sollte bereits das transformierte Material im `data`-Feld haben
      return {
        success: true,
        data: response.data, // Das Backend gibt direkt das LessonMaterialDto zurück
      };
    } catch (error) {
      console.error('[deepinfra-api] Error in createMaterial:', error);
      console.error('[deepinfra-api] Error details:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Fehler beim Erstellen des Materials in API',
        data: error.response?.data // Für detailliertere Fehlermeldungen vom Backend
      };
    }
  },

  // Update existing material
  async updateMaterial(id, materialData) {
    try {
      console.log('Updating material with data:', materialData);
      const response = await apiClient.put(`/materials/${id}`, materialData);
      console.log('Update response:', response.data);
      return {
        success: true,
        data: {
          id: response.data.id,
          title: response.data.topic,
          content: response.data.aiResponse,
          type: response.data.materialType,
          subject: response.data.subject || '',
          language: {
            level: response.data.languageLevel || 'B1',
            vocabPercentage: response.data.vocabPercentage || 30
          },
          created: response.data.createdAt,
          modified: response.data.modifiedAt || response.data.createdAt,
          tags: response.data.tags || []
        },
      };
    } catch (error) {
      console.error('Error updating material:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete material
  async deleteMaterial(id) {
    try {
      await apiClient.delete(`/materials/${id}`);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Health check for backend
  async checkConnection() {
    try {
      const response = await apiClient.get("/materials", { timeout: 5000 });
      return {
        success: true,
        message: "Backend connection successful",
      };
    } catch (error) {
      return {
        success: false,
        message: `Cannot connect to backend: ${error.message}`,
      };
    }
  },
};
