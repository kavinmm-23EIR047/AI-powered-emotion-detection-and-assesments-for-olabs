import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Camera, BarChart3, Shield, Play } from 'lucide-react';

interface QuizHomepageProps {
  onStartQuiz: () => void;
}

export const QuizHomepage: React.FC<QuizHomepageProps> = ({ onStartQuiz }) => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Advanced emotion detection and behavior analysis during your quiz"
    },
    {
      icon: Camera,
      title: "Real-time Monitoring",
      description: "Webcam-based proctoring with face detection and head pose analysis"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Comprehensive emotion charts and performance insights after completion"
    },
    {
      icon: Shield,
      title: "Secure Testing",
      description: "Anti-cheating measures with intelligent alert system"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="text-blue-600" size={48} />
            <h1 className="text-5xl font-bold text-gray-800">AI Quiz Assessment</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of online testing with real-time emotion analysis, 
            behavior monitoring, and comprehensive performance insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <feature.icon className="text-blue-600 mb-4" size={32} />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quiz Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Test Your Knowledge?
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <span className="text-gray-700">5 carefully crafted questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <span className="text-gray-700">Real-time emotion monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <span className="text-gray-700">Detailed performance analytics</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartQuiz}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play size={24} />
                Start Assessment
              </motion.button>
            </div>
            
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, 0, -1, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-8 text-white"
              >
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="h-4 bg-white bg-opacity-60 rounded mb-2"></div>
                    <div className="h-3 bg-white bg-opacity-40 rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white bg-opacity-20 rounded p-2">
                        <div className="h-2 bg-white bg-opacity-60 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera size={16} />
                      <span className="text-sm">Monitoring</span>
                    </div>
                    <div className="text-sm">3:45</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-600"
        >
          <p className="text-sm">
            🔒 Your privacy is protected. Camera data is processed locally and not stored permanently.
          </p>
        </motion.div>
      </div>
    </div>
  );
};