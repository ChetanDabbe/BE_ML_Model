from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from detect import process_image  # Import function from detect.py

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend to communicate with backend

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        image_data = data.get("image")
        
        if not image_data:
            return jsonify({"error": "No image data received"}), 400
        
        # Decode base64 image
        encoded_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(encoded_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Process the image with YOLO
        processed_image = process_image(image)

        # Encode the processed image to base64
        _, buffer = cv2.imencode('.jpg', processed_image)
        processed_image_base64 = base64.b64encode(buffer).decode()

        return jsonify({"processed_image": processed_image_base64})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
