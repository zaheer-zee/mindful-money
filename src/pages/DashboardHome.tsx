import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ChatAssistant } from "../components/ui/ChatAssistant";
import { useAuth } from "@/contexts/AuthContext";

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

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Metric cards moved to sidebar

const DashboardHome = () => {
  const { session } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // A set of colors matching the theme for dynamic pie charts
  const colors = [
    "hsl(174, 55%, 42%)",
    "hsl(192, 25%, 35%)",
    "hsl(38, 70%, 55%)",
    "hsl(174, 40%, 60%)",
    "hsl(174, 30%, 75%)",
    "hsl(200, 20%, 70%)"
  ];

  useEffect(() => {
    // Fetch real data from backend
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
          headers: {
            "Authorization": `Bearer ${session?.access_token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading specific financial insights...</div>;
  }

  if (!data) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Please complete onboarding to see insights.</div>;
  }

  // Enrich pie data with colors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pieData = data.distribution.map((item: any, i: number) => ({
    ...item,
    color: colors[i % colors.length]
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2"
      >
        <h2 className="font-display text-2xl font-bold text-foreground">Good Morning 👋</h2>
        <p className="text-muted-foreground text-sm">Here's your financial behavior overview based on recent statements.</p>
      </motion.div>

      {/* Metrics Grid removed - now living in the AppSidebar */}

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
              {/* Temporarily using mock data for the 6-month historical chart */}
              <BarChart data={[
                { month: "Oct", spent: 29000, saved: 11000 },
                { month: "Nov", spent: 27000, saved: 13000 },
                { month: "Dec", spent: 35000, saved: 5000 },
                { month: "Jan", spent: 31000, saved: 9000 },
                { month: "Feb", spent: 20000, saved: 20000 },
                { month: "Mar", spent: data.total_spent, saved: data.savings },
              ]} barGap={2}>
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
      {data.anomalies_detected > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-secondary/50 rounded-lg border border-border p-5"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-destructive/10 rounded-lg shrink-0">
              <Target size={20} className="text-destructive" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground">Behavioral Anomaly Warning</h4>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We noticed <span className="font-semibold text-primary">{data.anomalies_detected} unusual transactions</span> this month that deviate from your
                established baseline. Check the AI Chat below to get an explanation based on your profile goals.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions Table */}
      {data.recent_transactions && data.recent_transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-lg border border-border overflow-hidden shadow-card"
        >
          <div className="p-4 border-b border-border bg-secondary/30">
            <h3 className="font-display font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-border">
            {data.recent_transactions.map((tx: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${tx.is_anomaly ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    {tx.is_anomaly ? <AlertTriangle size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{tx.merchant}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-display font-semibold ${tx.is_anomaly ? 'text-destructive' : 'text-foreground'}`}>
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{tx.category}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Overview moved to AppSidebar */}

      {/* AI Chatbot Support */}
      <div className="mt-8">
        <ChatAssistant />
      </div>
    </div>
  );
};

export default DashboardHome;
