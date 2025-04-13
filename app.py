from flask import Flask, request, send_file
from werkzeug.utils import secure_filename
import os
from anime_converter import AnimeConverter
from PIL import Image
import io

app = Flask(__name__, static_folder='.', static_url_path='')

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize the converter
converter = AnimeConverter()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/convert', methods=['POST'])
def convert_image():
    if 'image' not in request.files:
        return 'No image file provided', 400
    
    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400
    
    try:
        # Read the image
        image = Image.open(file.stream)
        
        # Convert the image
        converted_image = converter.convert_image(image)
        
        if converted_image is None:
            return 'Error converting image', 500
        
        # Save the converted image to a bytes buffer
        img_byte_arr = io.BytesIO()
        converted_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Return the converted image
        return send_file(
            img_byte_arr,
            mimetype='image/png',
            as_attachment=False,
            download_name='converted.png'
        )
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return f'Error processing image: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 