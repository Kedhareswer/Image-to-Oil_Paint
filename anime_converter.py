import streamlit as st
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf
import os
import requests
from io import BytesIO

class AnimeConverter:
    def __init__(self):
        self.initialize_model()
        
    def initialize_model(self):
        # Create basic cartoon effect without external model
        pass

    def cartoonize(self, img):
        # Convert the image to RGB if it's RGBA
        if img.shape[-1] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
            
        # Convert to float32
        img_float = img.astype(np.float32) / 255.0

        # Apply bilateral filter for smoothing
        smooth = cv2.bilateralFilter(img, 9, 75, 75)
        
        # Convert to grayscale
        gray = cv2.cvtColor(smooth, cv2.COLOR_RGB2GRAY)
        
        # Apply median blur
        gray = cv2.medianBlur(gray, 5)
        
        # Detect edges
        edges = cv2.adaptiveThreshold(gray, 255,
                                    cv2.ADAPTIVE_THRESH_MEAN_C,
                                    cv2.THRESH_BINARY,
                                    9, 9)
        
        # Convert back to RGB
        edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)
        
        # Combine color image with edges
        cartoon = cv2.bitwise_and(smooth, edges)
        
        # Enhance colors
        cartoon = cv2.convertScaleAbs(cartoon, alpha=1.2, beta=10)
        
        # Apply color quantization
        cartoon = np.float32(cartoon).reshape((-1, 3))
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
        K = 8
        ret, label, center = cv2.kmeans(cartoon, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        center = np.uint8(center)
        result = center[label.flatten()]
        cartoon = result.reshape(img.shape)
        
        return cartoon

    def convert_image(self, image):
        try:
            # Convert PIL Image to numpy array
            np_image = np.array(image)
            
            # Apply cartoon effect
            cartoon = self.cartoonize(np_image)
            
            # Convert back to PIL Image
            return Image.fromarray(cartoon)
        except Exception as e:
            st.error(f"Error during conversion: {str(e)}")
            return None

def main():
    st.set_page_config(
        page_title="Oil Paint Style Converter",
        page_icon="🎨",
        layout="wide"
    )

    st.title("✨ Image to Oil Paint Style Converter")
    st.write("Transform your photos into Oil Paint-style artwork!")

    # Initialize converter
    converter = AnimeConverter()

    # File uploader
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        # Load and display original image
        image = Image.open(uploaded_file)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.header("Original Image")
            st.image(image, use_column_width=True)

        with col2:
            st.header("Oil Paint Style")
            
            # Convert button
            if st.button("🎨 Convert to Oil Paint Style"):
                with st.spinner("Converting image..."):
                    try:
                        # Convert image
                        anime_image = converter.convert_image(image)
                        
                        if anime_image is not None:
                            # Display converted image
                            st.image(anime_image, use_column_width=True)
                            
                            # Add download button
                            buf = BytesIO()
                            anime_image.save(buf, format="PNG")
                            byte_im = buf.getvalue()
                            
                            st.download_button(
                                label="⬇️ Download Oil Paint Image",
                                data=byte_im,
                                file_name="Oilpaint_style.png",
                                mime="image/png"
                            )
                    except Exception as e:
                        st.error(f"An error occurred: {str(e)}")

    # Add sidebar information
    st.sidebar.title("ℹ️ About")
    st.sidebar.info(
        """
        This app transforms your photos into oil paint-style artwork using 
        computer vision techniques. 
        
        **Tips for best results:**
        - Use clear, well-lit photos
        - Face photos work especially well
        - Avoid complex backgrounds
        - Make sure the subject is well-defined
        """
    )
    
    # Add footer
    st.markdown("""
        <style>
        .footer {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: #f0f2f6;
            color: #666;
            text-align: center;
            padding: 10px;
            font-size: 14px;
        }
        </style>
        <div class="footer">
            Made with ❤️ using Computer Vision
        </div>
        """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()