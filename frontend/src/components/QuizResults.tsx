import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Trophy, Clock, Target, Brain } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface QuizResultsProps {
  results: QuizResult;
  onRetake: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ results, onRetake }) => {
  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Prepare emotion timeline data
  const emotionTimelineData = results.emotionHistory.map((data, index) => ({
    time: `${Math.floor(index / 6)}:${((index % 6) * 10).toString().padStart(2, '0')}`,
    ...Object.fromEntries(
      Object.entries(data.emotions).map(([emotion, value]) => [
        emotion,
        Math.round(value * 100)
      ])
    )
  }));

  // Average emotions during quiz
  const avgEmotions = Object.keys(results.emotionHistory[0]?.emotions || {}).map(emotion => {
    const avg = results.emotionHistory.reduce((sum, data) => 
      sum + data.emotions[emotion as keyof typeof data.emotions], 0
    ) / results.emotionHistory.length;
    
    return {
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: Math.round(avg * 100)
    };
  });

  const gradeInfo = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-2 ${gradeInfo.bg} ${gradeInfo.color} px-4 py-2 rounded-full mb-4`}>
            <Trophy size={24} />
            <span className="text-2xl font-bold">{gradeInfo.grade}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600">
            You scored {results.score} out of {results.totalQuestions} questions correctly
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center gap-3">
              <Target className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-gray-800">{percentage}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center gap-3">
              <Brain className="text-purple-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Avg Faces</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(results.emotionHistory.reduce((sum, data) => sum + data.faceCount, 0) / results.emotionHistory.length)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Correct</p>
                <p className="text-2xl font-bold text-gray-800">{results.score}/{results.totalQuestions}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Average Emotions */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Emotions During Quiz</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgEmotions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Emotion Timeline */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg p-6 shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Emotion Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                <Legend />
                <Line type="monotone" dataKey="happy" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} />
                <Line type="monotone" dataKey="surprised" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="sad" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={onRetake}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Take Another Quiz
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};