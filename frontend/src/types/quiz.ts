export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface EmotionData {
  timestamp: number;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
    fearful: number;
    disgusted: number;
  };
  headPose: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  faceCount: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  emotionHistory: EmotionData[];
  answers: number[];
  questionEmotions: { [questionId: number]: EmotionData };
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
}