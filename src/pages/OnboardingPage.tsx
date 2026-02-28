import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, User, Briefcase, GraduationCap, Heart } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  data: Record<string, string>;
  setData: (d: Record<string, string>) => void;
}

const OptionCard = ({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
      selected
        ? "border-primary bg-secondary text-secondary-foreground shadow-soft"
        : "border-border bg-card text-card-foreground hover:border-primary/40"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon && <div className="text-primary">{icon}</div>}
      <span className="font-medium text-sm">{label}</span>
    </div>
  </button>
);

// Step 1: User Type
const UserTypeStep = ({ onNext, data, setData }: StepProps) => {
  const options = [
    { value: "school", label: "School Student", icon: <GraduationCap size={20} /> },
    { value: "college", label: "College Student", icon: <GraduationCap size={20} /> },
    { value: "working", label: "Working Professional", icon: <Briefcase size={20} /> },
    { value: "personal", label: "Personal Use", icon: <User size={20} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Who are you?</h2>
        <p className="text-muted-foreground mt-1">This helps us personalize your experience.</p>
      </div>
      <div className="grid gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            icon={opt.icon}
            selected={data.userType === opt.value}
            onClick={() => setData({ ...data, userType: opt.value })}
          />
        ))}
      </div>
      <Button onClick={onNext} disabled={!data.userType} className="w-full h-11">
        Continue <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

// Step 2: Income Context
const IncomeStep = ({ onNext, onBack, data, setData }: StepProps) => {
  const earnsOptions = [
    { value: "yes", label: "Yes, I earn money" },
    { value: "no", label: "No, I don't earn yet" },
    { value: "irregular", label: "Irregular income" },
  ];

  const rangeOptions = [
    { value: "0-10k", label: "Under ₹10,000" },
    { value: "10k-25k", label: "₹10,000 – ₹25,000" },
    { value: "25k-50k", label: "₹25,000 – ₹50,000" },
    { value: "50k+", label: "₹50,000+" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Income Context</h2>
        <p className="text-muted-foreground mt-1">Help us understand your financial situation.</p>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Do you earn money?</p>
        <div className="grid gap-2">
          {earnsOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={data.earns === opt.value}
              onClick={() => setData({ ...data, earns: opt.value })}
            />
          ))}
        </div>
      </div>
      {data.earns === "yes" && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Monthly income range</p>
          <div className="grid gap-2">
            {rangeOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={data.incomeRange === opt.value}
                onClick={() => setData({ ...data, incomeRange: opt.value })}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-11">
          <ArrowLeft size={16} />
        </Button>
        <Button onClick={onNext} disabled={!data.earns} className="flex-1 h-11">
          Continue <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Step 3: Behavioral Questions
const BehavioralStep = ({ onNext, onBack, data, setData }: StepProps) => {
  const triggers = [
    { value: "stress", label: "Stress / Emotional" },
    { value: "social", label: "Social Pressure" },
    { value: "convenience", label: "Convenience" },
    { value: "boredom", label: "Boredom" },
  ];

  const spendTimes = [
    { value: "weekends", label: "Weekends" },
    { value: "latenight", label: "Late Nights" },
    { value: "payday", label: "After Payday" },
    { value: "random", label: "Randomly" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Your Spending Behavior</h2>
        <p className="text-muted-foreground mt-1">Understanding your patterns helps us help you.</p>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">When do you spend most?</p>
        <div className="grid gap-2">
          {spendTimes.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={data.spendTime === opt.value}
              onClick={() => setData({ ...data, spendTime: opt.value })}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Primary spending trigger?</p>
        <div className="grid gap-2">
          {triggers.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={data.trigger === opt.value}
              onClick={() => setData({ ...data, trigger: opt.value })}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-11">
          <ArrowLeft size={16} />
        </Button>
        <Button onClick={onNext} disabled={!data.spendTime || !data.trigger} className="flex-1 h-11">
          Continue <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Step 4: Financial Goals (AI-style)
const GoalsStep = ({ onNext, onBack, data, setData }: StepProps) => {
  const goals = [
    { value: "emergency", label: "Build Emergency Fund" },
    { value: "invest", label: "Start Investing" },
    { value: "debtfree", label: "Become Debt-Free" },
    { value: "travel", label: "Save for Travel / Experience" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Your Financial Goals</h2>
        <p className="text-muted-foreground mt-1">
          If you saved consistently, what would change in your life?
        </p>
      </div>
      <div className="p-4 bg-secondary rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Heart size={18} className="text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-secondary-foreground leading-relaxed">
            "Financial awareness isn't about restriction — it's about aligning your spending with 
            what truly matters to you."
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">What's your primary goal?</p>
        <div className="grid gap-2">
          {goals.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={data.goal === opt.value}
              onClick={() => setData({ ...data, goal: opt.value })}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-11">
          <ArrowLeft size={16} />
        </Button>
        <Button onClick={onNext} disabled={!data.goal} className="flex-1 h-11">
          Finish Setup <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const steps = [
    <UserTypeStep key="user" onNext={() => setStep(1)} data={data} setData={setData} />,
    <IncomeStep key="income" onNext={() => setStep(2)} onBack={() => setStep(0)} data={data} setData={setData} />,
    <BehavioralStep key="behavior" onNext={() => setStep(3)} onBack={() => setStep(1)} data={data} setData={setData} />,
    <GoalsStep key="goals" onNext={handleFinish} onBack={() => setStep(2)} data={data} setData={setData} />,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Step {step + 1} of {totalSteps}
            </span>
            <span className="font-display text-sm font-bold text-primary">
              Spend<span className="text-foreground">Wise</span>
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
