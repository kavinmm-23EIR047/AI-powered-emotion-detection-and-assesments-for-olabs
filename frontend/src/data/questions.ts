import { Question } from '../types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary function of artificial intelligence?",
    options: [
      "To replace human workers completely",
      "To simulate human intelligence in machines", 
      "To create robots only",
      "To process data faster than humans"
    ],
    correctAnswer: 1,
    timeLimit: 30
  },
  {
    id: 2,
    question: "Which programming language is most commonly used for machine learning?",
    options: [
      "JavaScript",
      "Python",
      "Java",
      "C++"
    ],
    correctAnswer: 1,
    timeLimit: 25
  },
  {
    id: 3,
    question: "What does 'supervised learning' mean in machine learning?",
    options: [
      "Learning without human oversight",
      "Learning from labeled training data",
      "Learning only from text data", 
      "Learning through trial and error only"
    ],
    correctAnswer: 1,
    timeLimit: 35
  },
  {
    id: 4,
    question: "Which of the following is NOT a type of neural network?",
    options: [
      "Convolutional Neural Network (CNN)",
      "Recurrent Neural Network (RNN)",
      "Boolean Neural Network (BNN)",
      "Feedforward Neural Network"
    ],
    correctAnswer: 2,
    timeLimit: 30
  },
  {
    id: 5,
    question: "What is the purpose of data preprocessing in machine learning?",
    options: [
      "To make data look better visually",
      "To reduce the amount of data",
      "To clean and prepare data for training",
      "To encrypt the data"
    ],
    correctAnswer: 2,
    timeLimit: 25
  }
];