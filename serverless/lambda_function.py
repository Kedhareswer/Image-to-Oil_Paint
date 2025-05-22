import json
import base64
import cv2
import numpy as np
import traceback
import io

def apply_oil_paint_effect(img, radius=4, intensity=6, brush_count=20, color_vibrance=1.0):
    """Applies a realistic oil paint style filter that retains original image detail.
    
    Parameters:
    - img: Input image (NumPy array, BGR)
    - radius: Brush size (affects softness)
    - intensity: Stylization strength (higher = more painted)
    - brush_count: Number of colors for quantization
    - color_vibrance: Color enhancement factor
    """
    # Resize if needed for performance
    h, w = img.shape[:2]
    img = cv2.resize(img, (w // 2, h // 2)) if max(h, w) > 1000 else img

    # Normalize for float processing
    img_f = img.astype(np.float32) / 255.0

    # Step 1: Preserve edges but smooth within regions
    smoothed = cv2.bilateralFilter(img, d=radius*2, sigmaColor=75, sigmaSpace=75)

    # Step 2: Apply stylization (soft painterly abstraction)
    stylized = cv2.stylization(smoothed, sigma_s=60, sigma_r=0.5)

    # Step 3: Blend original + stylized to retain more structure
    detail_preserve = max(0.1, 1.0 - (intensity / 100.0))  # Convert intensity to detail preservation
    blended = cv2.addWeighted(img_f, detail_preserve, stylized.astype(np.float32)/255.0, 1 - detail_preserve, 0)

    # Step 4: Color quantization based on brush count
    Z = blended.reshape((-1, 3)).astype(np.float32)
    K = max(6, brush_count // 3)  # Convert brush count to reasonable number of colors
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, labels, centers = cv2.kmeans(Z, K, None, criteria, 5, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.clip(centers * color_vibrance, 0, 1)  # Apply color vibrance
    quantized = centers[labels.flatten()].reshape(blended.shape)

    # Step 5: Add soft canvas texture
    canvas_noise = np.random.normal(0, 0.01, quantized.shape).astype(np.float32)
    textured = np.clip(quantized + canvas_noise, 0, 1)

    # Step 6: Gentle color enhancement (like varnish/gloss)
    glossy = np.clip(textured * 1.08 + 0.03, 0, 1)

    return (glossy * 255).astype(np.uint8)

def lambda_handler(event, context):
    try:
        http_method = event.get('httpMethod')

        if http_method == 'GET':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'status': 'healthy', 'message': 'Oil paint converter is operational'})
            }
        
        elif http_method == 'POST':
            # Parse the input from the event
            body = json.loads(event.get('body', '{}'))
            
            # Get the base64-encoded image
            base64_image = body.get('image')
            if not base64_image:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No image provided'})
                }
            
            # Get parameters with defaults
            intensity = int(body.get('intensity', 50))
            brush_size = int(body.get('brushSize', 50))
            color_vibrance = int(body.get('colorVibrance', 100))
            
            # Decode the base64 image
            image_data = base64.b64decode(base64_image)
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise Exception("Failed to decode image")
            
            # Convert RGBA to RGB if needed
            if len(img.shape) > 2 and img.shape[-1] == 4:
                img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
            
            # Calculate parameters for the conversion
            requested_brush_count = int(body.get('brushCount', 50))
            brush_count_for_effect = max(6, requested_brush_count // 2) # Scales 0-100 brushCount from UI to 6-50 for effect
            
            radius = max(1, brush_size // 25) # Scales 0-100 brush_size from UI to 1-4 for effect
            color_vibrance_value = color_vibrance / 100.0 # Scales 0-100 color_vibrance from UI to 0.0-1.0 for effect
            
            # Apply oil paint effect
            result = apply_oil_paint_effect(
                img,
                radius=radius,
                intensity=intensity, # intensity is used directly (0-100 range)
                brush_count=brush_count_for_effect,
                color_vibrance=color_vibrance_value
            )
            
            # Encode the result as PNG
            is_success, buffer = cv2.imencode(".png", result)
            if not is_success:
                raise Exception("Failed to encode output image")
            
            # Convert to base64 for response
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            
            # Return the processed image
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=31536000, immutable'
                },
                'body': json.dumps({'image': encoded_image}),
                'isBase64Encoded': False
            }
        else:
            # Handle other methods or requests without httpMethod if necessary
            return {
                'statusCode': 405, # Method Not Allowed
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': f"Unsupported method: {http_method or 'Unknown'}"})
            }
            
    except Exception as e:
        print(f"Error during processing: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Failed to process image',
                'details': str(e)
            })
        }