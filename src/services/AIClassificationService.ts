// src/services/AIClassificationService.ts
import { AIClassifiedReceipt } from '../types/ReceiptInterfaces';
import Constants from 'expo-constants';
/**
 * Service to handle AI classification of receipt text
 */
export class AIClassificationService {
  private static API_KEY = Constants.expoConfig?.extra?.anthropicApiKey || ''; 

  /**
   * Classify receipt text using AI
   * 
   * @param extractedText The raw text extracted from the receipt image
   * @returns Classified receipt data
   */
  static async classifyReceipt(extractedText: string): Promise<AIClassifiedReceipt> {
    try {
      // First, try using the Claude API
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 1000,
            system: "You are an expert at analyzing receipt data. Extract the structured information from the provided receipt text.",
            messages: [
              {
                role: "user",
                content: `Analyze this receipt text and extract the following information:
                  - date: The receipt date in YYYY-MM-DD format
                  - type: Either "Fuel", "Maintenance", or "Other"
                  - amount: The total amount paid
                  - vehicle: Any vehicle identification
                  - vendorName: The name of the business
                  - location: The address if available
                  
                  Format your response as valid JSON with these exact field names.
                  
                  Raw receipt text:
                  ${extractedText}`
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Claude API Error:', response.status, errorText);
          throw new Error(`Claude API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Claude API Response:', JSON.stringify(data, null, 2));
        
        // Extract the text content from the response
        let textContent = '';
        if (data.content && Array.isArray(data.content)) {
          for (const contentItem of data.content) {
            if (contentItem.type === 'text') {
              textContent += contentItem.text;
            }
          }
        }
        
        // Try to parse JSON from the text response
        try {
          // Find JSON in the text (Claude sometimes wraps JSON in markdown)
          const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                           textContent.match(/```\s*([\s\S]*?)\s*```/) ||
                           textContent.match(/{[\s\S]*?}/);
                           
          const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
          const parsedResult = JSON.parse(jsonStr.replace(/```/g, '').trim());
          
          // Ensure all required fields exist with defaults if needed
          return {
            date: parsedResult.date || new Date().toISOString().split('T')[0],
            type: parsedResult.type || 'Other',
            amount: parsedResult.amount || '$0.00',
            vehicle: parsedResult.vehicle || 'Unknown Vehicle',
            vendorName: parsedResult.vendorName || 'Unknown Vendor',
            location: parsedResult.location || '',
            confidence: 0.85
          };
        } catch (parseError) {
          console.error('Failed to parse Claude JSON response:', parseError);
          console.log('Raw text content:', textContent);
          throw parseError;
        }
      } catch (apiError) {
        console.error('Claude API failed, using fallback:', apiError);
        throw apiError; // Pass to fallback
      }
    } catch (error) {
      console.log('Using fallback classification method');
      // Use the fallback method if the API call fails
      return this.fallbackClassification(extractedText);
    }
  }
  
  /**
   * Fallback method to classify text if the API call fails
   */
  private static fallbackClassification(text: string): AIClassifiedReceipt {
    return {
      date: this.extractDate(text),
      type: this.determineReceiptType(text),
      amount: this.extractAmount(text),
      vehicle: this.extractVehicle(text),
      vendorName: this.extractVendorName(text),
      location: this.extractLocation(text),
      confidence: 0.6 // Lower confidence for fallback method
    };
  }
  
  // Helper methods for text extraction
  
  private static extractDate(text: string): string {
    // Look for date patterns in the text
    const dateRegex = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}/g;
    const match = text.match(dateRegex);
    
    if (match && match.length > 0) {
      return match[0];
    }
    
    // Default to current date if not found
    return new Date().toISOString().split('T')[0];
  }
  
  private static extractAmount(text: string): string {
    // Look for currency amounts
    const amountRegex = /\$\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:USD|EUR|GBP)/g;
    const match = text.match(amountRegex);
    
    if (match && match.length > 0) {
      return match[0];
    }
    
    // Try another pattern
    const numberRegex = /(?:total|amount|due|payment).*?(\$?\s*\d+(?:\.\d{2})?)/i;
    const secondMatch = text.match(numberRegex);
    
    if (secondMatch && secondMatch[1]) {
      return secondMatch[1].trim();
    }
    
    return "$0.00";
  }
  
  private static determineReceiptType(text: string): 'Fuel' | 'Maintenance' | 'Other' {
    const lowerText = text.toLowerCase();
    
    // Check for fuel-related keywords
    if (lowerText.includes('fuel') || 
        lowerText.includes('gas') || 
        lowerText.includes('diesel') || 
        lowerText.includes('gallon') || 
        lowerText.includes('litre') ||
        lowerText.includes('pump')) {
      return 'Fuel';
    }
    
    // Check for maintenance-related keywords
    if (lowerText.includes('repair') || 
        lowerText.includes('maintenance') || 
        lowerText.includes('service') || 
        lowerText.includes('parts') || 
        lowerText.includes('oil change') ||
        lowerText.includes('mechanic')) {
      return 'Maintenance';
    }
    
    // Default
    return 'Other';
  }
  
  private static extractVehicle(text: string): string {
    // Look for vehicle identifiers
    const vehicleRegex = /(?:vehicle|truck|car|unit)\s*(?:id|number|#)?[:. ]*([a-z0-9-]+)/i;
    const match = text.match(vehicleRegex);
    
    if (match && match[1]) {
      return `Truck ${match[1].toUpperCase()}`;
    }
    
    // Default
    return "Unknown Vehicle";
  }
  
  private static extractVendorName(text: string): string {
    // This is a simplified approach - real implementation would be more sophisticated
    const lines = text.split('\n');
    
    // Often the vendor name is at the top of the receipt
    if (lines.length > 0 && lines[0].trim() !== '') {
      return lines[0].trim();
    }
    
    return "Unknown Vendor";
  }
  
  private static extractLocation(text: string): string {
    // Look for address patterns
    const addressRegex = /(?:\d+\s+[a-z]+\s+(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive))/i;
    const match = text.match(addressRegex);
    
    if (match) {
      return match[0];
    }
    
    return "";
  }
}