import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const quotes = [
  "Small expenses silently destroy big dreams.",
  "Awareness is the first step to financial freedom.",
  "Your money habits define your future self.",
  "Every rupee saved is a rupee earned toward your goals.",
  "Discipline today. Freedom tomorrow.",
  "Track. Reflect. Transform.",
  "The best time to start saving was yesterday. The next best time is now.",
];

const LoadingScreen = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(quoteInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => navigate("/auth"), 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="mb-12">
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Spend<span className="text-primary">Wise</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Behavioral Finance Platform</p>
        </div>

        <div className="h-24 flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-foreground/80 italic font-light leading-relaxed"
            >
              "{quotes[currentQuote]}"
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">Loading your experience…</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
