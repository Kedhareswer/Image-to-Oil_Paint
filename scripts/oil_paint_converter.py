import cv2
import numpy as np

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

# Main execution
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 7:
        print("Usage: python oil_paint_converter.py <input_path> <output_path> <radius> <intensity> <brush_count> <color_vibrance>")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    radius = int(sys.argv[3])
    intensity = int(sys.argv[4])
    brush_count = int(sys.argv[5])
    color_vibrance = int(sys.argv[6])
    
    try:
        # Read image
        img = cv2.imread(input_path)
        if img is None:
            raise Exception("Failed to read image")
            
        # Convert RGBA to RGB if needed
        if img.shape[-1] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
        
        # Apply oil paint effect with parameters
        result = apply_oil_paint_effect(
            img,
            radius=max(1, radius // 25),  # Scale down radius to reasonable range
            intensity=intensity,
            brush_count=max(6, brush_count // 2),  # Scale down brush count
            color_vibrance=color_vibrance / 100.0  # Scale color vibrance to 0-1 range
        )
        
        # Save the result
        cv2.imwrite(output_path, result)
        print("Conversion successful")
        sys.exit(0)
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        sys.exit(1)