# # app.py
# import base64
# import cv2
# import numpy as np
# import mediapipe as mp
# from flask import Flask
# from flask_socketio import SocketIO, emit
# from deepface import DeepFace
# import time

# # -----------------------------
# # Flask + SocketIO Setup
# # -----------------------------
# app = Flask(__name__)
# app.config["SECRET_KEY"] = "secret!"
# socketio = SocketIO(app, cors_allowed_origins="*")

# # -----------------------------
# # MediaPipe Setup
# # -----------------------------
# mp_face_mesh = mp.solutions.face_mesh
# mp_hands = mp.solutions.hands
# face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
# hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# # -----------------------------
# # Preload DeepFace model
# # -----------------------------
# emotion_model = DeepFace.build_model("Emotion")  # Preload once for faster inference

# # -----------------------------
# # Helper Functions
# # -----------------------------
# def decode_image(data_url):
#     img_bytes = base64.b64decode(data_url.split(",")[1])
#     np_arr = np.frombuffer(img_bytes, np.uint8)
#     frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
#     return frame

# def detect_gesture(frame):
#     gesture = {"thinking": 0.0, "confused": 0.0}
#     rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#     results = hands.process(rgb)
#     if results.multi_hand_landmarks:
#         for hand_landmarks in results.multi_hand_landmarks:
#             y_positions = [lm.y for lm in hand_landmarks.landmark]
#             avg_y = sum(y_positions) / len(y_positions)
#             if avg_y < 0.4:  # Upper hand → thinking
#                 gesture["thinking"] = 1.0
#             elif 0.4 <= avg_y <= 0.6:  # Middle hand → confused
#                 gesture["confused"] = 1.0
#     return gesture

# def get_head_pose(frame, landmarks):
#     h, w, _ = frame.shape
#     nose = landmarks[1]  # Nose tip
#     x = int(nose.x * w)
#     y = int(nose.y * h)
#     yaw = (x - w/2) / (w/2) * 30   # -30 to 30 degrees
#     pitch = (y - h/2) / (h/2) * 20 # -20 to 20 degrees
#     return {"yaw": yaw, "pitch": pitch, "roll": 0.0}

# def analyze_emotion(frame):
#     try:
#         analysis = DeepFace.analyze(
#             frame, actions=["emotion"], enforce_detection=False, models={"emotion": emotion_model}
#         )
#         dominant_emotion = analysis["dominant_emotion"].lower()
#         emotions = {"happy":0,"neutral":0,"sad":0,"fearful":0}
#         for emo in emotions.keys():
#             emotions[emo] = 1.0 if emo == dominant_emotion else 0.0
#         return emotions
#     except Exception:
#         # fallback if detection fails
#         return {"happy":0,"neutral":1,"sad":0,"fearful":0}

# # -----------------------------
# # WebSocket Handlers
# # -----------------------------
# @socketio.on("connect")
# def handle_connect():
#     print("✅ Frontend connected")
#     emit("connected", {"message": "Connected"})

# @socketio.on("disconnect")
# def handle_disconnect():
#     print("❌ Frontend disconnected")

# @socketio.on("frame")
# def handle_frame(data):
#     try:
#         frame = decode_image(data)
#         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         # Face detection & landmarks
#         face_results = face_mesh.process(rgb)
#         face_count = 0
#         head_pose = {"yaw": 0.0, "pitch": 0.0, "roll": 0.0}
#         emotions = {"happy":0,"neutral":1,"sad":0,"fearful":0,"thinking":0,"confused":0}

#         if face_results.multi_face_landmarks:
#             face_count = len(face_results.multi_face_landmarks)
#             landmarks = face_results.multi_face_landmarks[0].landmark
#             head_pose = get_head_pose(frame, landmarks)
#             emotions.update(analyze_emotion(frame))

#         # Gesture detection
#         gestures = detect_gesture(frame)
#         emotions.update(gestures)

#         emit("emotion_data", {
#             "faceCount": face_count,
#             "headPose": head_pose,
#             "emotions": emotions,
#             "timestamp": time.time()
#         })

#     except Exception as e:
#         print(f"⚠️ Error processing frame: {e}")

# # -----------------------------
# # Run Backend
# # -----------------------------
# if __name__ == "__main__":
#     socketio.run(app, host="0.0.0.0", port=5000, debug=True)
# app.py
import base64
import cv2
import numpy as np
import mediapipe as mp
from flask import Flask
from flask_socketio import SocketIO, emit
from deepface import DeepFace
import time
import math

# -----------------------------
# Flask + SocketIO Setup
# -----------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")

# -----------------------------
# MediaPipe Setup
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp_hands = mp.solutions.hands
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# -----------------------------
# Preload DeepFace model
# -----------------------------
emotion_model = DeepFace.build_model("Emotion")  # Preload once for faster inference

# -----------------------------
# Helper Functions
# -----------------------------
def decode_image(data_url):
    img_bytes = base64.b64decode(data_url.split(",")[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame

def calculate_distance(point1, point2):
    """Calculate Euclidean distance between two landmarks"""
    return math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

def detect_gesture(frame):
    """Improved gesture detection based on hand position relative to face landmarks"""
    gesture = {"thinking": 0.0, "confused": 0.0}
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Get both hand and face landmarks
    hand_results = hands.process(rgb)
    face_results = face_mesh.process(rgb)
    
    if hand_results.multi_hand_landmarks and face_results.multi_face_landmarks:
        face_landmarks = face_results.multi_face_landmarks[0].landmark
        
        # Key face landmark indices
        nose_tip = face_landmarks[1]  # Nose tip
        mouth_center = face_landmarks[13]  # Upper lip center
        forehead_center = face_landmarks[9]  # Forehead center
        chin = face_landmarks[175]  # Chin
        
        for hand_landmarks in hand_results.multi_hand_landmarks:
            # Get fingertip positions (index finger tip and middle finger tip)
            index_tip = hand_landmarks.landmark[8]  # Index finger tip
            middle_tip = hand_landmarks.landmark[12]  # Middle finger tip
            thumb_tip = hand_landmarks.landmark[4]   # Thumb tip
            
            # Calculate average hand position
            hand_center_x = (index_tip.x + middle_tip.x + thumb_tip.x) / 3
            hand_center_y = (index_tip.y + middle_tip.y + thumb_tip.y) / 3
            
            # Distance thresholds for gesture detection
            mouth_distance = calculate_distance(
                type('obj', (object,), {'x': hand_center_x, 'y': hand_center_y})(),
                mouth_center
            )
            
            forehead_distance = calculate_distance(
                type('obj', (object,), {'x': hand_center_x, 'y': hand_center_y})(),
                forehead_center
            )
            
            # Gesture detection logic
            # Hand near mouth (thinking gesture)
            if mouth_distance < 0.15 and hand_center_y > mouth_center.y - 0.1:
                gesture["thinking"] = min(1.0, gesture["thinking"] + 0.8)
            
            # Hand near forehead/temple area (confused gesture)
            elif (forehead_distance < 0.2 and 
                  hand_center_y < forehead_center.y + 0.1 and
                  hand_center_y > forehead_center.y - 0.15):
                gesture["confused"] = min(1.0, gesture["confused"] + 0.8)
    
    return gesture

def get_head_pose(frame, landmarks):
    """Head pose estimation with proper thresholds for significant movement"""
    h, w, _ = frame.shape
    
    # Key facial landmarks
    nose_tip = landmarks[1]
    left_eye = landmarks[33]
    right_eye = landmarks[263]
    chin = landmarks[175]
    forehead = landmarks[9]
    left_cheek = landmarks[234]
    right_cheek = landmarks[454]
    
    # Convert to pixel coordinates
    def to_2d(lm):
        return np.array([lm.x * w, lm.y * h])
    
    nose_2d = to_2d(nose_tip)
    left_eye_2d = to_2d(left_eye)
    right_eye_2d = to_2d(right_eye)
    chin_2d = to_2d(chin)
    forehead_2d = to_2d(forehead)
    left_cheek_2d = to_2d(left_cheek)
    right_cheek_2d = to_2d(right_cheek)
    
    # ---------------- Horizontal calculation ----------------
    eye_center = (left_eye_2d + right_eye_2d) / 2
    nose_to_center = nose_2d[0] - eye_center[0]
    eye_distance = np.linalg.norm(right_eye_2d - left_eye_2d)
    cheek_distance_left = np.linalg.norm(left_cheek_2d - nose_2d)
    cheek_distance_right = np.linalg.norm(right_cheek_2d - nose_2d)
    cheek_ratio = (cheek_distance_right - cheek_distance_left) / max(cheek_distance_left, cheek_distance_right, 1)
    horizontal_ratio = nose_to_center / (eye_distance / 2) if eye_distance > 0 else 0
    combined_horizontal = horizontal_ratio + (cheek_ratio * 0.5)
    
    # Horizontal thresholds for significant movement
    if combined_horizontal > 0.25 or cheek_ratio > 0.3:  
        horizontal_direction = "right"
    elif combined_horizontal < -0.25 or cheek_ratio < -0.3:
        horizontal_direction = "left"
    else:
        horizontal_direction = "straight"
    
    # ---------------- Vertical calculation ----------------
    face_height = abs(forehead_2d[1] - chin_2d[1])
    face_mid_y = (forehead_2d[1] + chin_2d[1]) / 2
    nose_offset_y = nose_2d[1] - face_mid_y  # positive = nose below center, negative = above center
    
    vertical_threshold = face_height * 0.15  # 15% of face height
    
    if nose_offset_y > vertical_threshold:
        vertical_direction = "down"
    elif nose_offset_y < -vertical_threshold:
        vertical_direction = "up"
    else:
        vertical_direction = "straight"
    
    # ---------------- Overall direction ----------------
    if horizontal_direction == "straight" and vertical_direction == "straight":
        overall_direction = "straight"
    elif horizontal_direction != "straight" and vertical_direction == "straight":
        overall_direction = horizontal_direction
    elif horizontal_direction == "straight" and vertical_direction != "straight":
        overall_direction = vertical_direction
    else:
        overall_direction = horizontal_direction if abs(combined_horizontal) > abs(nose_offset_y / (face_height / 2)) else vertical_direction
    
    return {
        "direction": overall_direction,
        "horizontal": horizontal_direction,
        "vertical": vertical_direction
    }


def analyze_emotion(frame):
    try:
        analysis = DeepFace.analyze(
            frame, actions=["emotion"], enforce_detection=False, models={"emotion": emotion_model}
        )
        dominant_emotion = analysis["dominant_emotion"].lower()
        emotions = {"happy":0,"neutral":0,"sad":0,"fearful":0}
        for emo in emotions.keys():
            emotions[emo] = 1.0 if emo == dominant_emotion else 0.0
        return emotions
    except Exception:
        # fallback if detection fails
        return {"happy":0,"neutral":1,"sad":0,"fearful":0}

# -----------------------------
# WebSocket Handlers
# -----------------------------
@socketio.on("connect")
def handle_connect():
    print("✅ Frontend connected")
    emit("connected", {"message": "Connected"})

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ Frontend disconnected")

@socketio.on("frame")
def handle_frame(data):
    try:
        frame = decode_image(data)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Face detection & landmarks
        face_results = face_mesh.process(rgb)
        face_count = 0
        head_pose = {"direction": "straight", "horizontal": "straight", "vertical": "straight"}
        emotions = {"happy":0,"neutral":1,"sad":0,"fearful":0,"thinking":0,"confused":0}

        if face_results.multi_face_landmarks:
            face_count = len(face_results.multi_face_landmarks)
            landmarks = face_results.multi_face_landmarks[0].landmark
            head_pose = get_head_pose(frame, landmarks)
            emotions.update(analyze_emotion(frame))

        # Gesture detection (improved)
        gestures = detect_gesture(frame)
        emotions.update(gestures)

        emit("emotion_data", {
            "faceCount": face_count,
            "headPose": head_pose,
            "emotions": emotions,
            "timestamp": time.time()
        })

    except Exception as e:
        print(f"⚠️ Error processing frame: {e}")

# -----------------------------
# Run Backend
# -----------------------------
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)