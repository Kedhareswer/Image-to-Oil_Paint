# Image to Oil Painting Converter

A web application that converts regular images into oil painting style artwork using computer vision techniques.

## Features

- Upload images and convert them to oil painting style
- Real-time preview of the conversion
- Download converted images
- Modern and responsive user interface

## Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/image-to-oil-painting.git
cd image-to-oil-painting
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Streamlit server:
```bash
streamlit run app.py
```

2. Open your web browser and navigate to the URL shown in the terminal (typically http://localhost:8501)

## Usage

1. Click the "Upload Image" button to select an image from your computer
2. The application will automatically process the image and show both the original and converted versions
3. Use the "Download" button to save the converted image

## Technologies Used

- Python
- Streamlit
- OpenCV
- Pillow
- NumPy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
