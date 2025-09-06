import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { QuizHomepage } from './components/QuizHomepage';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { WebcamMonitor } from './components/WebcamMonitor';
import { AlertSystem } from './components/AlertSystem';
import { useWebSocket } from './hooks/useWebSocket';
import { quizQuestions } from './data/questions';
import { QuizResult, EmotionData } from './types/quiz';

type AppState = 'home' | 'quiz' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [questionEmotions, setQuestionEmotions] = useState<{ [questionId: number]: EmotionData }>({});

  const {
    isConnected,
    emotionData,
    alerts,
    startAnalysis,
    stopAnalysis,
    sendFrame,
    clearAlerts
  } = useWebSocket();

  const startQuiz = useCallback(() => {
    setCurrentState('quiz');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(Date.now());
    setEmotionHistory([]);
    setQuestionEmotions({});
    startAnalysis();
    toast.success('Quiz started! Webcam monitoring is now active.');
  }, [startAnalysis]);

  const handleAnswer = useCallback((answer: number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Store emotion data for this question
    if (emotionData) {
      setQuestionEmotions(prev => ({
        ...prev,
        [quizQuestions[currentQuestionIndex].id]: emotionData
      }));
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(newAnswers);
    }
  }, [answers, currentQuestionIndex, emotionData]);

  const handleTimeUp = useCallback(() => {
    handleAnswer(-1); // -1 indicates no answer selected
    toast.error('Time\'s up! Moving to next question.');
  }, [handleAnswer]);

  const finishQuiz = useCallback((finalAnswers: number[]) => {
    stopAnalysis();
    
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    
    const score = finalAnswers.reduce((total, answer, index) => {
      return total + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);

    const results: QuizResult = {
      score,
      totalQuestions: quizQuestions.length,
      timeSpent,
      emotionHistory,
      answers: finalAnswers,
      questionEmotions
    };

    setCurrentState('results');
    toast.success(`Quiz completed! You scored ${score}/${quizQuestions.length}`);
  }, [stopAnalysis, startTime, emotionHistory, questionEmotions]);

  const handleFrameCapture = useCallback((frameData: string) => {
    sendFrame(frameData);
  }, [sendFrame]);

  const handleRetakeQuiz = useCallback(() => {
    setCurrentState('home');
    clearAlerts();
  }, [clearAlerts]);

  const dismissAlert = useCallback((alertId: string) => {
    // This would typically remove the alert from the alerts array
    // For now, we'll just show a toast
    toast.success('Alert dismissed');
  }, []);

  // Update emotion history when new data arrives
  React.useEffect(() => {
    if (emotionData && currentState === 'quiz') {
      setEmotionHistory(prev => [...prev, emotionData]);
    }
  }, [emotionData, currentState]);

  const calculateResults = (): QuizResult => {
    const score = answers.reduce((total, answer, index) => {
      return total + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);

    return {
      score,
      totalQuestions: quizQuestions.length,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      emotionHistory,
      answers,
      questionEmotions
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />
      
      <WebcamMonitor
        isActive={currentState === 'quiz'}
        onFrameCapture={handleFrameCapture}
        emotionData={emotionData}
      />

      <AnimatePresence mode="wait">
        {currentState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizHomepage onStartQuiz={startQuiz} />
          </motion.div>
        )}

        {currentState === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <QuizQuestion
              question={quizQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              onTimeUp={handleTimeUp}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizQuestions.length}
            />
          </motion.div>
        )}

        {currentState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizResults
              results={calculateResults()}
              onRetake={handleRetakeQuiz}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isConnected && currentState === 'quiz' && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          Connection to AI server lost. Monitoring may be limited.
        </div>
      )}
    </div>
  );
}

export default App;