import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    title: "Weekend Spending Spike",
    description:
      "You spend 45% more on weekends compared to weekdays. Most of this goes to food delivery and entertainment.",
    type: "warning" as const,
  },
  {
    icon: AlertTriangle,
    title: "Shopping Budget Exceeded",
    description:
      "You've exceeded your shopping budget by ₹800 this month. Consider pausing non-essential purchases.",
    type: "alert" as const,
  },
  {
    icon: Sparkles,
    title: "Great Discipline on Transport",
    description:
      "You're 20% under your transport budget. Your commuting habits are cost-effective.",
    type: "success" as const,
  },
  {
    icon: Lightbulb,
    title: "Saving Opportunity",
    description:
      "Switching from daily café visits to home-brewed coffee could save you ₹2,400/month.",
    type: "tip" as const,
  },
];

const typeStyles = {
  warning: "bg-warning/10 text-warning",
  alert: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  tip: "bg-primary/10 text-primary",
};

const InsightsPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">AI Insights</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Personalized observations based on your spending behavior.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg border border-border p-5 shadow-card"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg shrink-0 ${typeStyles[insight.type]}`}>
                <insight.icon size={18} />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-foreground">
                  {insight.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivational */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary rounded-lg p-5 text-center"
      >
        <p className="text-sm text-secondary-foreground italic">
          "The goal is not to be perfect, but to be aware."
        </p>
      </motion.div>
    </div>
  );
};

export default InsightsPage;
