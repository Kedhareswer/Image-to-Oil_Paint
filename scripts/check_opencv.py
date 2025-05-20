import sys
import traceback

try:
    import cv2
    import numpy as np
    
    # Print OpenCV version
    print(f"OpenCV {cv2.__version__}")
    
    # Create a small test image to verify OpenCV functionality
    test_img = np.zeros((10, 10, 3), dtype=np.uint8)
    test_result = cv2.blur(test_img, (3, 3))
    
    if test_result is not None:
        sys.exit(0)
    else:
        print("OpenCV failed to process test image")
        sys.exit(1)
        
except Exception as e:
    print(f"Error checking OpenCV: {str(e)}")
    print(f"Traceback: {traceback.format_exc()}")
    sys.exit(1)