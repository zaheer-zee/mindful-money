import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Target,
  Tags,
  Upload,
  Lightbulb,
  LogOut,
  TrendingDown,
  TrendingUp,
  Home,
  PieChart,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Categories", url: "/dashboard/categories", icon: Tags },
  { title: "Upload Statements", url: "/dashboard/upload", icon: Upload },
  { title: "Insights", url: "/dashboard/insights", icon: Lightbulb },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { session } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
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
      }
    };

    fetchDashboardData();
  }, [session]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <span className="font-display text-sm font-bold text-sidebar-primary">
                Mindful<span className="text-sidebar-foreground">Money</span>
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && data && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>
              <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Financial Overview
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-4 space-y-4 mt-2">
              {/* Monthly Budget Tracker */}
              <div className="bg-sidebar-accent/30 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground">
                    <Wallet size={14} className="text-primary" />
                    Monthly Budget
                  </div>
                  <span className="text-xs font-bold">₹{data.monthly_budget.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground mr-2">Spent: ₹{data.total_spent.toLocaleString("en-IN")}</span>
                  <span className={`text-[10px] font-medium ${data.total_spent > data.monthly_budget ? "text-destructive" : "text-success"}`}>
                    {((data.total_spent / data.monthly_budget) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-primary ${data.total_spent > data.monthly_budget ? "bg-destructive" : ""}`}
                    style={{ width: `${Math.min((data.total_spent / data.monthly_budget) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Discipline Score */}
              <div className="bg-sidebar-accent/30 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground">
                    <Target size={14} className="text-accent" />
                    Discipline Score
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${data.discipline_score > 80 ? "text-success" : "text-destructive"}`}>
                    {data.discipline_score > 80 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {data.discipline_score}
                  </div>
                </div>
              </div>

              {/* Mini Categories */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground mb-2">
                  <Tags size={14} className="text-sidebar-foreground/70" />
                  Top Categories Menu
                </div>
                <div className="space-y-1">
                  {data.distribution.slice(0, 4).map((cat: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                    <div key={cat.name} className="flex justify-between items-center text-[11px] py-1">
                      <span className="text-sidebar-foreground/80 truncate pr-2">{cat.name}</span>
                      <span className="font-medium text-sidebar-foreground">₹{(cat.value / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout" onClick={() => supabase.auth.signOut()}>
              <button className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
