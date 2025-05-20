'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Slider } from './ui/slider';

interface ClientFallbackProcessorProps {
  imageFile: File | null;
  onProcessed: (result: string) => void;
  intensity: number;
  brushSize: number;
  colorVibrance: number;
}

/**
 * A client-side fallback for image processing when server-side processing fails
 * Implements a simplified oil paint effect using canvas filters
 */
export function ClientFallbackProcessor({
  imageFile,
  onProcessed,
  intensity,
  brushSize,
  colorVibrance
}: ClientFallbackProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async () => {
    if (!imageFile) {
      setError('No image provided');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create an image from the file
      const imageUrl = URL.createObjectURL(imageFile);
      const image = new Image();
      
      image.onload = () => {
        // Create a canvas to process the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setError('Canvas context not available');
          setIsProcessing(false);
          return;
        }
        
        // Set canvas dimensions
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw the original image
        ctx.drawImage(image, 0, 0);
        
        // Apply filters based on parameters
        // Adjust saturation based on colorVibrance
        const saturationValue = colorVibrance / 100;
        ctx.filter = `saturate(${saturationValue})`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        
        // Apply blur based on brushSize
        const blurValue = brushSize / 20;
        ctx.filter = `blur(${blurValue}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        
        // Apply contrast based on intensity
        const contrastValue = 100 + intensity * 2;
        ctx.filter = `contrast(${contrastValue}%)`;
        ctx.drawImage(canvas, 0, 0);
        
        // Get the processed image as data URL
        const processedImageUrl = canvas.toDataURL('image/png');
        
        // Clean up
        URL.revokeObjectURL(imageUrl);
        
        // Return the processed image
        onProcessed(processedImageUrl);
        setIsProcessing(false);
      };
      
      image.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
        URL.revokeObjectURL(imageUrl);
      };
      
      // Start loading the image
      image.src = imageUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Client-side Processing</h3>
        <Button 
          onClick={processImage} 
          disabled={isProcessing || !imageFile}
          variant="secondary"
        >
          {isProcessing ? 'Processing...' : 'Process Locally'}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        This is a simplified version of the oil paint effect that runs in your browser.
        It may not produce results as high quality as the server-side processing.
      </div>
    </div>
  );
}