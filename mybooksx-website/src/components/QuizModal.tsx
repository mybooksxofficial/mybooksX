import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import './QuizModal.css';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (code: string, discount: string) => void;
}

interface Question {
  id: number;
  question: string;
  category: 'Math' | 'GK' | 'Geography';
  options: string[];
  correct: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is 15 × 8 + 30?",
    category: "Math",
    options: ["140", "150", "160", "170"],
    correct: 1 // 150
  },
  {
    id: 2,
    question: "Which river is the longest in India?",
    category: "Geography",
    options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"],
    correct: 1 // Ganga
  },
  {
    id: 3,
    question: "Who is known as the Father of the Indian Constitution?",
    category: "GK",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correct: 1 // Dr. B.R. Ambedkar
  },
  {
    id: 4,
    question: "What is 25% of 800?",
    category: "Math",
    options: ["150", "200", "250", "300"],
    correct: 1 // 200
  },
  {
    id: 5,
    question: "Which Indian city is popularly known as the 'Silicon Valley of India'?",
    category: "GK",
    options: ["Hyderabad", "Bengaluru", "Pune", "Gurugram"],
    correct: 1 // Bengaluru
  },
  {
    id: 6,
    question: "Which desert is located in Rajasthan, India?",
    category: "Geography",
    options: ["Thar Desert", "Sahara Desert", "Gobi Desert", "Kalahari Desert"],
    correct: 0 // Thar Desert
  },
  {
    id: 7,
    question: "What is the square root of 144?",
    category: "Math",
    options: ["11", "12", "14", "16"],
    correct: 1 // 12
  },
  {
    id: 8,
    question: "Which Indian state has the longest coastline?",
    category: "Geography",
    options: ["Maharashtra", "Tamil Nadu", "Gujarat", "Andhra Pradesh"],
    correct: 2 // Gujarat
  },
  {
    id: 9,
    question: "What does 'HTTP' stand for in software and networking?",
    category: "GK",
    options: [
      "HyperText Transfer Protocol",
      "High Tech Transfer Page",
      "Hyperlink Text Terminal Port",
      "Host Transport Tool Protocol"
    ],
    correct: 0 // HyperText Transfer Protocol
  },
  {
    id: 10,
    question: "If a software task takes 12 days for 2 engineers, how many days will 4 engineers take (assuming equal productivity)?",
    category: "Math",
    options: ["4 days", "6 days", "8 days", "3 days"],
    correct: 1 // 6 days
  }
];

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onApplyDiscount }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedDiscount, setEarnedDiscount] = useState('0%');
  const [promoCode, setPromoCode] = useState('');

  // Persist single attempt in localStorage
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('mybooksx_quiz_score');
      const savedCode = localStorage.getItem('mybooksx_quiz_code');
      const savedDiscount = localStorage.getItem('mybooksx_quiz_discount');
      if (savedCode && savedDiscount) {
        setHasCompleted(true);
        setScore(Number(savedScore) || 10);
        setEarnedDiscount(savedDiscount);
        setPromoCode(savedCode);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentIdx];

  const handleSelectOption = (optIndex: number) => {
    const updatedAnswers = [...selectedAnswers, optIndex];
    setSelectedAnswers(updatedAnswers);

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score out of 10
      let correctCount = 0;
      quizQuestions.forEach((q, i) => {
        if (updatedAnswers[i] === q.correct) {
          correctCount++;
        }
      });

      // 1.5% per correct question => up to 15% discount for 10/10!
      const discountVal = (correctCount * 1.5).toFixed(1);
      const discountFormatted = `${discountVal}%`;
      const codeGenerated = `QUIZ${correctCount * 15}GENIUS`;

      setScore(correctCount);
      setEarnedDiscount(discountFormatted);
      setPromoCode(codeGenerated);
      setHasCompleted(true);

      try {
        localStorage.setItem('mybooksx_quiz_score', correctCount.toString());
        localStorage.setItem('mybooksx_quiz_code', codeGenerated);
        localStorage.setItem('mybooksx_quiz_discount', discountFormatted);
      } catch (e) {
        // Fallback
      }

      if (correctCount > 5) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Fallback
        }
      }
    }
  };

  const handleApply = () => {
    if (promoCode && earnedDiscount) {
      onApplyDiscount(promoCode, earnedDiscount);
      onClose();
    }
  };

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div className="quiz-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quiz-close-btn" onClick={onClose} aria-label="Close Quiz">
          <X size={20} />
        </button>

        {hasCompleted ? (
          <div className="quiz-result-view">
            <div className="quiz-award-icon">
              <Award size={48} className="text-royal" />
            </div>
            <h3>Quiz Completed!</h3>
            <p className="quiz-score-sub">
              You answered <strong>{score} of 10</strong> questions correctly! (1.5% discount per question)
            </p>

            <div className="quiz-discount-pill">
              <span>UNLOCKED DISCOUNT:</span>
              <strong>{earnedDiscount} OFF</strong>
            </div>

            <div className="quiz-coupon-box">
              <span>PROMO CODE:</span>
              <strong>{promoCode}</strong>
            </div>

            <button type="button" onClick={handleApply} className="btn-primary w-full mt-3">
              <CheckCircle size={18} />
              <span>Apply {earnedDiscount} to My Project</span>
            </button>

            <p className="single-attempt-disclaimer">
              <AlertCircle size={13} className="inline-icon" /> Note: Only 1 quiz attempt allowed per device.
            </p>
          </div>
        ) : (
          <div className="quiz-question-view">
            <div className="quiz-progress-header">
              <div className="quiz-tag-row">
                <span className="quiz-category-tag">{currentQ.category}</span>
                <span className="quiz-counter">Question {currentIdx + 1} of 10</span>
              </div>
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="quiz-question-title">{currentQ.question}</h3>

            <div className="quiz-options-list">
              {currentQ.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  className="quiz-option-btn"
                  onClick={() => handleSelectOption(oIdx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              ))}
            </div>

            <div className="quiz-perk-hint">
              <span>💡 Earn 1.5% discount for every correct answer (up to 15% OFF)!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
