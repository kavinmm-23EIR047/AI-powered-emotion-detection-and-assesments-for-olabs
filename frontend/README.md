# AI-Based Quiz Assessment System

A comprehensive quiz assessment platform with real-time emotion analysis, webcam monitoring, and behavioral insights.

## Features

### 🎯 Core Functionality
- **Interactive Quiz System**: Timed questions with multiple choice answers
- **Real-time Emotion Detection**: AI-powered analysis of student emotions during testing
- **Webcam Proctoring**: Face detection, head pose analysis, and behavior monitoring
- **Comprehensive Analytics**: Detailed emotion charts and performance insights
- **Anti-cheating Measures**: Multiple face detection, looking away alerts, and suspicious behavior warnings

### 🖥️ Frontend Features
- **Responsive Design**: Optimized for desktop quiz-taking experience
- **Real-time Emotion Display**: Live emotion bars in corner during test
- **Interactive Charts**: Post-test emotion timeline and analysis
- **Alert System**: Non-intrusive popup alerts for monitoring
- **Smooth Animations**: Professional UI with micro-interactions

### 🧠 AI Backend Features
- **Computer Vision**: OpenCV and MediaPipe for face analysis
- **Emotion Recognition**: TensorFlow-based emotion classification
- **Head Pose Estimation**: Real-time tracking of head position
- **Behavioral Analysis**: Intelligent detection of suspicious activities
- **WebSocket Communication**: Real-time data streaming

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Webcam** for camera integration
- **Socket.IO Client** for real-time communication

### Backend
- **Python 3.8+** with Flask
- **Flask-SocketIO** for WebSocket communication
- **OpenCV** for image processing
- **MediaPipe** for face detection and pose estimation
- **TensorFlow** for emotion recognition
- **NumPy** for numerical operations

## Installation & Setup

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

#### Option 1: Automatic Installation
```bash
cd backend
python install_dependencies.py
python app.py
```

#### Option 2: Manual Installation
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

### System Requirements

**Minimum Requirements:**
- Node.js 16+
- Python 3.8+
- Webcam access
- Modern web browser with WebRTC support

**For Full AI Features:**
- 4GB+ RAM
- GPU (optional, for faster processing)
- CMake (for MediaPipe compilation)
- Visual C++ Build Tools (Windows only)

## Usage

1. **Start the Backend**: Run `python app.py` in the `backend` directory
2. **Start the Frontend**: Run `npm run dev` in the root directory
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Take Quiz**: Click "Start Assessment" and allow camera permissions
5. **Monitor Progress**: Watch real-time emotion analysis in the corner
6. **View Results**: See comprehensive analytics after completion

## Architecture

### Data Flow
1. **Video Capture**: React webcam captures frames
2. **Frame Processing**: Frames sent to Python backend via WebSocket
3. **AI Analysis**: Computer vision processes faces and emotions
4. **Real-time Updates**: Emotion data streamed back to frontend
5. **Alert System**: Suspicious behavior triggers alerts
6. **Results Analysis**: Comprehensive charts generated from collected data

### Security Features
- **Privacy Protection**: Camera data processed locally, not stored
- **Secure Communication**: WebSocket connections with proper CORS
- **Behavioral Monitoring**: Multi-layered cheating detection
- **Data Isolation**: Each session maintains separate data streams

## Customization

### Adding Questions
Edit `src/data/questions.ts` to modify quiz questions:

```typescript
export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Your question here",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 1, // Index of correct answer
    timeLimit: 30 // Seconds
  }
];
```

### Emotion Model
Replace the mock emotion detection in `backend/app.py` with your trained model:

```python
# Load your trained emotion model
self.emotion_model = load_model('path/to/your/model.h5')

# Update emotion detection function
def detect_emotions(self, face_roi):
    # Your emotion detection logic here
    predictions = self.emotion_model.predict(face_roi)
    return predictions
```

### Alert Thresholds
Modify alert triggers in `backend/app.py`:

```python
def check_suspicious_behavior(self, analysis_result):
    # Customize alert conditions
    if abs(head_pose['yaw']) > 45:  # Adjust angle threshold
        # Trigger alert
```

## Development

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Install in development mode
pip install -e .

# Run with debug mode
python app.py

# Test WebSocket connections
# Use Socket.IO client tools or browser developer tools
```

### Adding Features

1. **New Emotion Types**: Update emotion labels in backend and frontend
2. **Additional Sensors**: Extend WebSocket protocol for new data types
3. **Enhanced Analytics**: Add new chart types in results component
4. **Mobile Support**: Implement responsive webcam positioning

## Troubleshooting

### Common Issues

**Camera Access Denied**
- Ensure HTTPS or localhost
- Check browser permissions
- Test camera in other applications

**Backend Connection Failed**
- Verify Python dependencies installed
- Check Flask server is running on port 5000
- Ensure no firewall blocking connections

**Poor Emotion Detection**
- Ensure good lighting conditions
- Position face clearly in camera view
- Install full TensorFlow/MediaPipe dependencies

**Performance Issues**
- Reduce frame capture rate in `WebcamMonitor.tsx`
- Use smaller image resolution
- Consider GPU acceleration for ML processing

### Debug Mode

Enable debug logging:

```javascript
// Frontend debug mode
localStorage.setItem('debug', 'true');

// Backend debug mode  
export FLASK_DEBUG=1
python app.py
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console and backend logs
- Ensure all dependencies are properly installed
- Test with minimal setup first

## Future Enhancements

- **Advanced Emotion Models**: Integration with state-of-the-art emotion recognition
- **Voice Analysis**: Audio-based stress and emotion detection
- **Biometric Integration**: Heart rate and other physiological measurements
- **Advanced Proctoring**: Eye tracking and attention analysis
- **Mobile App**: Native iOS/Android applications
- **Cloud Deployment**: Scalable cloud infrastructure setup