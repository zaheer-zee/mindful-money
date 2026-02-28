import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const analysisSteps = [
  "Reading transactions…",
  "Understanding spending behavior…",
  "Cleaning merchant names…",
  "Building financial profile…",
  "Calculating real statistics…",
];

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= analysisSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setAnalyzing(false);
        }, 600);
      } else {
        setCurrentStep(step);
      }
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Upload Statement</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your bank statement (CSV or PDF) for AI analysis.
        </p>
      </div>

      {!analyzing && !done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/40 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            {file ? file.name : "Drop your statement here or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Supports CSV and PDF formats</p>
        </motion.div>
      )}

      {file && !analyzing && !done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 p-3 bg-secondary rounded-lg">
            <FileText size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
          </div>
          <Button onClick={handleAnalyze} className="h-10">
            Analyze
          </Button>
        </motion.div>
      )}

      {analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-8">
          {analysisSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              {i < currentStep ? (
                <CheckCircle2 size={18} className="text-primary" />
              ) : i === currentStep ? (
                <Loader2 size={18} className="text-primary animate-spin" />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
              )}
              <span className={`text-sm ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
          <h3 className="font-display text-xl font-bold text-foreground">Analysis Complete</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Your financial profile has been updated. Check the dashboard for insights.
          </p>
          <Button className="mt-6" onClick={() => { setFile(null); setDone(false); }}>
            Upload Another
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default UploadPage;
