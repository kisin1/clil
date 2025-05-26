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

export default {
  // Main method to generate lesson materials
  async generateMaterial(materialType, params = {}) {
    try {
      console.log(
        `Generating material: ${materialType} for topic: ${params.topic}`
      );

      // Request payload matching the Spring Boot MaterialRequest DTO
      const requestPayload = {
        materialType: materialType,
        topic: params.topic,
        prompt: params.prompt,
      };

      // Call Spring Boot endpoint
      const response = await apiClient.post("/generate", requestPayload);

      // Transform response to match frontend expectations
      return {
        success: true,
        data: {
          title: `${materialType}: ${params.topic}`,
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
          type: material.materialType,
          topic: material.topic,
          preview: material.preview,
          createdAt: new Date(material.createdAt).toLocaleDateString(),
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
    try {
      const response = await apiClient.get(`/materials/${id}`);
      return {
        success: true,
        data: {
          title: `${response.data.materialType}: ${response.data.topic}`,
          content: response.data.aiResponse,
          metadata: {
            id: response.data.id,
            type: response.data.materialType,
            topic: response.data.topic,
            createdAt: response.data.createdAt,
          },
        },
      };
    } catch (error) {
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
      return { success: true };
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
