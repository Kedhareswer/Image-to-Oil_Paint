# Image to Oil Paint Style Converter

![Oil Paint Style Converter](public/placeholder.svg)

[![GitHub license](https://img.shields.io/github/license/Kedhareswer/Image-to-Oil_Paint)](LICENSE)

Transform your ordinary photos into beautiful oil paint style artwork with enhanced texture and depth. This web application uses advanced computer vision techniques to create realistic oil painting effects.

---

## Features

- **Easy Image Upload**: Drag & drop or browse to upload your images
- **Camera Integration**: Take photos directly with your device camera
- **Customizable Effects**: Adjust intensity, brush size, and color vibrance
- **Real-time Conversion**: Transform your photos with a single click
- **Download Options**: Save your oil paint masterpieces to your device
- **Responsive Design**: Works on desktop and mobile devices

---

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Serverless Python (e.g., AWS Lambda) with OpenCV for the primary oil paint effect. Local Python/OpenCV are used for local health checks and development testing.
- **UI Components**: Shadcn UI component library
- **Image Processing**: Advanced computer vision techniques for oil paint effects

---

## How It Works

The application uses a sophisticated image processing pipeline to transform photos:

1. **Image Analysis**: Your image is analyzed to identify edges, textures, and color patterns
2. **Brush Stroke Simulation**: Multiple layers of simulated brush strokes are applied
3. **Color Blending & Texture**: Advanced color quantization and canvas texture create the rich look of oil paintings

---

## Technical Details

The conversion engine uses several techniques to achieve an authentic oil paint effect:

- Multi-layer brush simulation with varying sizes and directions
- Canvas texture integration to mimic real painting surfaces
- Adaptive color quantization for the distinctive oil paint look
- Edge-aware stylization to preserve important details
- Dynamic brush pressure simulation for realistic results

The core image processing pipeline is deployed as a serverless function (e.g., AWS Lambda) to ensure scalability and availability. See the `serverless/lambda_function.py` for the backend implementation.
---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or pnpm

#### Environment Variables
To use the oil paint effect feature, you need to configure the following environment variable:
- `SERVERLESS_FUNCTION_URL`: The URL of your deployed serverless oil paint converter function (e.g., AWS Lambda URL).
Create a `.env.local` file in the project root and add your environment variables there:
```
SERVERLESS_FUNCTION_URL=your_lambda_function_url_here
```
(Note: The health check API will also report if this URL is not configured.)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Kedhareswer/Image-to-Oil_Paint.git
   cd Image-to-Oil_Paint
   ```

2. Install JavaScript dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Install Python dependencies
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

---

## Usage Tips

For best results:

- Use clear, well-lit photos with good contrast
- Portraits and landscapes work especially well
- Images with distinct subjects and simple backgrounds produce the best results
- Adjust the intensity sliders to fine-tune the oil paint effect
- Try different brush sizes for varying artistic styles

---

## Project Structure

- `/app` - Next.js application pages and API routes
- `/components` - React components including the image converter
- `/public` - Static assets
- `/scripts` - Python scripts for image processing
- `/serverless` - Contains the AWS Lambda function code (`lambda_function.py`) for the serverless oil paint conversion.
- `/styles` - Global CSS styles
- `cartoon_streamlit_app.py` - A standalone Streamlit application for an experimental cartoon effect (not integrated with the main Next.js app).

---

## Future Enhancements

- AI-powered brush stroke analysis based on famous artists' styles
- Artist style presets (Van Gogh, Monet, Rembrandt)
- Selective area processing for targeted effects
- Real-time preview of different settings
- Video conversion to oil paint style animations

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by traditional oil painting techniques
- Built with modern web and computer vision technologies
- Special thanks to the open-source community for the tools and libraries used in this project