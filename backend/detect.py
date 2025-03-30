from ultralytics import YOLO
import cv2
import numpy as np

# Load YOLO models
bottle_model = YOLO("F:/BE_Project/Final Year Project 2025/last-project/backend/models/yolov8n.pt")  # Pre-trained model for bottle detection
defect_model = YOLO("F:/BE_Project/Final Year Project 2025/last-project/backend/models/best.pt")      # Custom-trained model for defect detection

# Class names for defect detection
defect_class_names = ['thread-cut', 'dent', 'bubble', 'scratch', 'deform']

# Confidence thresholds
BOTTLE_CONF_THRESHOLD = 0.2
DEFECT_CONF_THRESHOLD = 0.1

def process_image(image):
    """
    Detects bottles and defects in the given image and draws bounding boxes.
    """
    print("Processing image...")
    
    # Detect bottles in the image
    bottle_results = bottle_model(image)[0]
    detected_bottles = []
    
    for result in bottle_results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result

        # Check if detected object is a bottle
        if bottle_results.names[int(class_id)] == "bottle" and score > BOTTLE_CONF_THRESHOLD:
            detected_bottles.append((x1, y1, x2, y2, score))
            print(f"Detected BOTTLE: ({x1}, {y1}), ({x2}, {y2}) - Confidence: {score:.2f}")
            
            # Draw bounding box
            cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            label = f"BOTTLE ({score:.2f})"
            cv2.putText(image, label, (int(x1), int(y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            # Crop bottle region
            bottle_crop = image[int(y1):int(y2), int(x1):int(x2)]
            if bottle_crop.size > 0:
                defect_results = defect_model(bottle_crop)[0]
                
                for defect in defect_results.boxes.data.tolist():
                    dx1, dy1, dx2, dy2, defect_score, defect_class_id = defect
                    if defect_score > DEFECT_CONF_THRESHOLD:
                        defect_x1 = int(x1 + dx1)
                        defect_y1 = int(y1 + dy1)
                        defect_x2 = int(x1 + dx2)
                        defect_y2 = int(y1 + dy2)
                        
                        defect_class_name = defect_class_names[int(defect_class_id)]
                        print(f"Detected DEFECT ({defect_class_name}): ({defect_x1}, {defect_y1}), ({defect_x2}, {defect_y2}) - Confidence: {defect_score:.2f}")
                        
                        # Draw defect bounding box
                        cv2.rectangle(image, (defect_x1, defect_y1), (defect_x2, defect_y2), (0, 0, 255), 2)
                        defect_label = f"{defect_class_name.upper()} ({defect_score:.2f})"
                        cv2.putText(image, defect_label, (defect_x1, defect_y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

    if not detected_bottles:
        print("No bottles detected.")
    
    return image
