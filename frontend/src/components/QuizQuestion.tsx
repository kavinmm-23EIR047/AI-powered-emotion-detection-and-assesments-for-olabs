import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
  onTimeUp: () => void;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;      // call for Next button
  onSubmit: () => void;    // call for Submit button
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  onTimeUp,
  questionNumber,
  totalQuestions,
  onNext,
  onSubmit
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    setTimeLeft(question.timeLimit);
    setSelectedAnswer(null);
    setIsTimeUp(false);
  }, [question]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isTimeUp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isTimeUp) {
      setIsTimeUp(true);
      onTimeUp(); // optional callback
    }
  }, [timeLeft, isTimeUp, onTimeUp]);

  const handleSelect = (index: number) => {
    if (!selectedAnswer && !isTimeUp) setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
      onNext();
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      onSubmit();
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 15) return 'text-green-600';
    if (timeLeft > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg ${getTimeColor()}`}>
          <Clock size={20} />
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="grid gap-4 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: selectedAnswer !== null || isTimeUp ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(index)}
            disabled={selectedAnswer !== null || isTimeUp}
            className={`p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${selectedAnswer !== null || isTimeUp ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedAnswer === index 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-gray-300'
            }`}>
              {selectedAnswer === index && <CheckCircle size={16} />}
              {selectedAnswer !== index && (
                <span className="text-sm font-medium text-gray-500">
                  {String.fromCharCode(65 + index)}
                </span>
              )}
            </div>
            <span className="text-gray-800 font-medium">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        {questionNumber < totalQuestions ? (
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
              selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition ${
              selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Submit
          </button>
        )}
      </div>

      {isTimeUp && !selectedAnswer && (
        <div className="mt-4 text-center text-red-600 text-sm">
          Time's up! You cannot select an answer.
        </div>
      )}
    </motion.div>
  );
};
