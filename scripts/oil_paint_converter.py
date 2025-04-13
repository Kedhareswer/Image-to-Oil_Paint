import cv2
import numpy as np

def apply_oil_paint_effect(img, radius=5, intensity=12, brush_count=30, color_vibrance=1.0):
    """
    Apply an enhanced oil paint effect with stylized brush strokes, rich color layers, and canvas texture.
    
    Parameters:
    - img: Input image (NumPy array in BGR format)
    - radius: Base brush size
    - intensity: Strength of stylization and abstraction
    - brush_count: Number of brush stroke layers
    """
    
    # Resize for consistent output (optional)
    img = cv2.resize(img, (img.shape[1] // 2, img.shape[0] // 2))

    # Preprocess
    img = img.astype(np.float32) / 255.0
    result = img.copy()

    # Generate canvas texture
    canvas_color = np.ones_like(img) * 0.95
    noise = (np.random.rand(*img.shape) * 0.05).astype(np.float32)
    canvas_texture = canvas_color - noise

    # Apply multiple layered stylized strokes
    for i in range(brush_count):
        # Randomized variation
        brush_size = radius + np.random.randint(-2, 3)
        sigma_s = 10 + i % 5
        sigma_r = 0.1 + (i % 4) * 0.05

        # Stylize layer
        stylized = cv2.stylization((result * 255).astype(np.uint8), sigma_s=sigma_s, sigma_r=sigma_r)
        stylized = stylized.astype(np.float32) / 255.0

        # Apply localized random masks
        mask = (np.random.rand(*img.shape[:2]) > 0.85).astype(np.float32)
        mask = cv2.GaussianBlur(mask, (brush_size*2+1, brush_size*2+1), 0)
        mask = mask[:, :, np.newaxis]

        # Blend with result
        result = result * (1 - mask) + stylized * mask

    # Color boost and glossiness with adjustable vibrance
    result = np.clip(result * (1.0 + color_vibrance * 0.3) + 0.05, 0, 1)

    # Color quantization using k-means
    Z = result.reshape((-1, 3))
    Z = np.float32(Z)
    K = 8 + intensity // 2
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, labels, centers = cv2.kmeans(Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.clip(centers, 0, 1)
    quantized = centers[labels.flatten()].reshape(result.shape)

    # Edge texture (simulate paint ridges)
    edges = cv2.Canny((img * 255).astype(np.uint8), 60, 120)
    edges = cv2.dilate(edges, None)
    edges = cv2.GaussianBlur(edges, (3, 3), 0)
    edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR).astype(np.float32) / 255.0

    # Subtract edges to create depth
    final = np.clip(quantized - edges * 0.15, 0, 1)

    # Blend with canvas texture
    final = np.clip(final * 0.9 + canvas_texture * 0.1, 0, 1)

    # Convert back to uint8
    return (final * 255).astype(np.uint8)

# Main execution
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 6:
        print("Usage: python oil_paint_converter.py <input_path> <output_path> <radius> <intensity> <brush_count>")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    radius = int(sys.argv[3])
    intensity = int(sys.argv[4])
    brush_count = int(sys.argv[5])
    
    try:
        # Read image
        img = cv2.imread(input_path)
        if img is None:
            raise Exception("Failed to read image")
            
        # Convert RGBA to RGB if needed
        if img.shape[-1] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
        
        # Apply oil paint effect with parameters
        result = apply_oil_paint_effect(img, radius=radius, intensity=intensity, brush_count=brush_count, color_vibrance=intensity/50.0)
        
        # Save the result
        cv2.imwrite(output_path, result)
        print("Conversion successful")
        sys.exit(0)
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        sys.exit(1)