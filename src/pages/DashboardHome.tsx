import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const AnimatedNumber = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-IN")}</span>;
};

const pieData = [
  { name: "Food", value: 8500, color: "hsl(174, 55%, 42%)" },
  { name: "Transport", value: 3200, color: "hsl(174, 40%, 60%)" },
  { name: "Shopping", value: 5800, color: "hsl(38, 70%, 55%)" },
  { name: "Entertainment", value: 2400, color: "hsl(174, 30%, 75%)" },
  { name: "Rent", value: 12000, color: "hsl(192, 25%, 35%)" },
  { name: "Others", value: 3100, color: "hsl(200, 20%, 70%)" },
];

const barData = [
  { month: "Jul", spent: 28000, saved: 12000 },
  { month: "Aug", spent: 32000, saved: 8000 },
  { month: "Sep", spent: 25000, saved: 15000 },
  { month: "Oct", spent: 29000, saved: 11000 },
  { month: "Nov", spent: 27000, saved: 13000 },
  { month: "Dec", spent: 35000, saved: 5000 },
];

const MetricCard = ({
  title,
  value,
  prefix,
  subtitle,
  icon: Icon,
  trend,
  delay,
}: {
  title: string;
  value: number;
  prefix?: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-card rounded-lg border border-border p-5 shadow-card"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-secondary rounded-lg">
        <Icon size={18} className="text-primary" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend === "up" ? "text-success" : "text-destructive"
        }`}>
          {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend === "up" ? "+12%" : "-5%"}
        </div>
      )}
    </div>
    <p className="font-display text-2xl font-bold text-foreground">
      <AnimatedNumber value={value} prefix={prefix} />
    </p>
    <p className="text-sm text-muted-foreground mt-1">{title}</p>
    <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
  </motion.div>
);

const DashboardHome = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2"
      >
        <h2 className="font-display text-2xl font-bold text-foreground">Good Morning 👋</h2>
        <p className="text-muted-foreground text-sm">Here's your financial behavior overview.</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Budget"
          value={40000}
          prefix="₹"
          subtitle="Allocated this month"
          icon={Target}
          delay={0.1}
        />
        <MetricCard
          title="Total Spent"
          value={35000}
          prefix="₹"
          subtitle="87.5% of budget used"
          icon={TrendingDown}
          trend="down"
          delay={0.2}
        />
        <MetricCard
          title="Savings"
          value={5000}
          prefix="₹"
          subtitle="This month"
          icon={PiggyBank}
          trend="up"
          delay={0.3}
        />
        <MetricCard
          title="Discipline Score"
          value={72}
          subtitle="Based on spending habits"
          icon={TrendingUp}
          trend="up"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-lg border border-border p-5 shadow-card"
        >
          <h3 className="font-display text-base font-semibold text-foreground mb-4">
            Spending Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(174, 15%, 88%)",
                    boxShadow: "0 2px 8px hsl(174, 30%, 50%, 0.08)",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-lg border border-border p-5 shadow-card"
        >
          <h3 className="font-display text-base font-semibold text-foreground mb-4">
            Spending vs Savings
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={2}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(192, 10%, 46%)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(192, 10%, 46%)" }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(174, 15%, 88%)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="spent" fill="hsl(174, 55%, 42%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saved" fill="hsl(174, 30%, 75%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
              Spent
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-sm bg-accent" />
              Saved
            </div>
          </div>
        </motion.div>
      </div>

      {/* Behavioral Nudge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-secondary rounded-lg border border-border p-5"
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
            <Target size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Saving Potential</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Based on your spending patterns, you had the potential to save{" "}
              <span className="font-semibold text-primary">₹8,200</span> more this month.
              Your top opportunity: reducing weekend food delivery orders by 30%.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-4">Category Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Food & Dining", spent: 8500, limit: 10000, urgency: "Important" },
            { name: "Transport", spent: 3200, limit: 4000, urgency: "Urgent" },
            { name: "Shopping", spent: 5800, limit: 5000, urgency: "Not Urgent" },
            { name: "Entertainment", spent: 2400, limit: 3000, urgency: "Not Important" },
            { name: "Rent & Bills", spent: 12000, limit: 12000, urgency: "Urgent & Important" },
            { name: "Others", spent: 3100, limit: 6000, urgency: "Not Urgent" },
          ].map((cat) => {
            const pct = Math.min((cat.spent / cat.limit) * 100, 100);
            const isOver = cat.spent > cat.limit;
            return (
              <div key={cat.name} className="bg-card rounded-lg border border-border p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isOver
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {cat.urgency}
                  </span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-lg font-display font-bold text-foreground">
                    ₹{cat.spent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / ₹{cat.limit.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
