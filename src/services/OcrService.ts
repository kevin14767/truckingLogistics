// src/services/OcrService.ts
import * as FileSystem from 'expo-file-system';

const API_URL = 'https://trucking-ocr-service-42754ea93d31.herokuapp.com/api/ocr/base64';

export class OcrService {
  /**
   * Uploads an image to the backend for OCR processing
   * @param imageUri Local URI of the image
   * @returns Promise containing recognized text
   */
  static async recognizeText(imageUri: string): Promise<string> {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Format for sending to server
      const imageData = `data:image/jpeg;base64,${base64}`;

      // Send to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`OCR service error: ${response.status}`);
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error('Error in OCR processing:', error);
      throw error;
    }
  }
}