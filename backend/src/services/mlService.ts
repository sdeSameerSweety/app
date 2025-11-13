/**
 * ML Service Integration
 * Communicates with Python ML service for face verification, content moderation, etc.
 */
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/env';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001/api/ml';

// Timeout for ML operations
const ML_TIMEOUT = 30000; // 30 seconds

/**
 * Face Verification Service
 */
export const verifyFaceWithLiveness = async (imagePath: string) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(
      `${ML_SERVICE_URL}/face/verify`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Face verification error:', error.message);
    throw new Error(`Face verification failed: ${error.message}`);
  }
};

export const extractFaceEmbedding = async (imagePath: string) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(
      `${ML_SERVICE_URL}/face/extract-embedding`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Embedding extraction error:', error.message);
    throw new Error(`Embedding extraction failed: ${error.message}`);
  }
};

export const compareFaces = async (imagePath1: string, imagePath2: string) => {
  try {
    const formData = new FormData();
    formData.append('image1', fs.createReadStream(imagePath1));
    formData.append('image2', fs.createReadStream(imagePath2));

    const response = await axios.post(
      `${ML_SERVICE_URL}/face/compare`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Face comparison error:', error.message);
    throw new Error(`Face comparison failed: ${error.message}`);
  }
};

export const detectDuplicateAccount = async (
  imagePath: string,
  existingEmbeddings: any[]
) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('embeddings', JSON.stringify(existingEmbeddings));

    const response = await axios.post(
      `${ML_SERVICE_URL}/face/detect-duplicate`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Duplicate detection error:', error.message);
    throw new Error(`Duplicate detection failed: ${error.message}`);
  }
};

/**
 * Content Moderation Service
 */
export const moderateImage = async (imagePath: string) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(
      `${ML_SERVICE_URL}/content/moderate-image`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Image moderation error:', error.message);
    throw new Error(`Image moderation failed: ${error.message}`);
  }
};

export const moderateText = async (text: string) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/content/moderate-text`,
      { text },
      { timeout: ML_TIMEOUT }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Text moderation error:', error.message);
    throw new Error(`Text moderation failed: ${error.message}`);
  }
};

/**
 * Document Verification Service
 */
export const verifyDocument = async (
  documentPath: string,
  documentType: string = 'general'
) => {
  try {
    const formData = new FormData();
    formData.append('document', fs.createReadStream(documentPath));
    formData.append('type', documentType);

    const response = await axios.post(
      `${ML_SERVICE_URL}/document/verify`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT * 2, // Documents may take longer
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Document verification error:', error.message);
    throw new Error(`Document verification failed: ${error.message}`);
  }
};

export const extractDocumentText = async (documentPath: string) => {
  try {
    const formData = new FormData();
    formData.append('document', fs.createReadStream(documentPath));

    const response = await axios.post(
      `${ML_SERVICE_URL}/document/extract-text`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: ML_TIMEOUT * 2,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Text extraction error:', error.message);
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};

/**
 * Recommendation Service
 */
export const getCollegeRecommendations = async (
  userId: string,
  preferences: any,
  history: any[]
) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/recommendations/colleges`,
      {
        userId,
        preferences,
        history,
      },
      { timeout: ML_TIMEOUT }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - College recommendations error:', error.message);
    throw new Error(`Recommendations failed: ${error.message}`);
  }
};

export const getReviewRecommendations = async (
  userId: string,
  history: any[]
) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/recommendations/reviews`,
      {
        userId,
        history,
      },
      { timeout: ML_TIMEOUT }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Review recommendations error:', error.message);
    throw new Error(`Recommendations failed: ${error.message}`);
  }
};

export const trainRecommendationModel = async (trainingData: any[]) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/recommendations/train`,
      { data: trainingData },
      { timeout: ML_TIMEOUT * 3 } // Training may take longer
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service - Model training error:', error.message);
    throw new Error(`Model training failed: ${error.message}`);
  }
};

/**
 * Health Check
 */
export const checkMLServiceHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL.replace('/api/ml', '')}/health`, {
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error('ML Service health check failed:', error.message);
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
};
