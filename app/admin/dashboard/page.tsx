"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Users,
  RefreshCw,
  Building2,
  MapPin,
  Store,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
type StatWithChange = {
  title: string;
  name?: string | undefined;
  today: number;
  value?: { name?: string } | string;
  yesterday: number;
  subtitle?: string | undefined;
  change: number;
  changeType: "positive" | "negative";
};

type DynamicStats = {
  totalReviewsToday: StatWithChange;
  negativeFeedbacks: StatWithChange;
  counsellingAlerts: number;
  topPerformerToday: StatWithChange;
  totalBrands: number;
  totalStates: number;
  totalCities: number;
  totalOutlets: number;
  totalEmployees: number;
  recentActivity: {
    employee: string;
    outlet: string;
    rating: number;
    time: string;
  }[];
};

export default function DashboardPage() {
  const { showLoading, hideLoading, showToast } = useLoading();
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dynamicStats, setDynamicStats] = useState<DynamicStats>({
    totalReviewsToday: {
      title: "Total Reviews Today",
      today: 0,
      yesterday: 0,
      change: 0,
      changeType: "positive",
    },
    topPerformerToday: {
      title: "Top Performer Today",
      today: 0,
      yesterday: 0,
      change: 0,
      changeType: "positive",
    },
    negativeFeedbacks: {
      title: "Negative Feedbacks",
      today: 0,
      yesterday: 0,
      change: 0,
      changeType: "positive",
    },
    counsellingAlerts: 0,
    totalBrands: 0,
    totalStates: 0,
    totalCities: 0,
    totalOutlets: 0,
    totalEmployees: 0,
    recentActivity: [],
  });
  // const cookieStore = cookies();
  // const session = cookieStore.get("admin_session");
  // if (!session) {
  //   redirect("/admin/login");
  // }

  const refreshData = async (showToastNotification = false) => {
    setIsRefreshing(true);
    
    if (showToastNotification) {
      showLoading("Refreshing dashboard data...");
    }
    
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const { data } = await res.json();
        console.log(data);
        setDynamicStats({ ...data });
        
        if (showToastNotification) {
          hideLoading();
          showToast("Dashboard data refreshed successfully!", "success");
        }
      } else {
        console.log("Can not load the dashboard data ");
        
        if (showToastNotification) {
          hideLoading();
          showToast("Failed to refresh dashboard data", "error");
        }
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      
      if (showToastNotification) {
        hideLoading();
        showToast("Failed to refresh dashboard data", "error");
      }
    }
    
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    refreshData(false); // Initial load without toast
    const interval = setInterval(() => {
      refreshData(false); // Auto refresh without toast
      setLastUpdated(new Date());
    }, 30000); // Auto refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      ...dynamicStats.totalReviewsToday,
      icon: MessageSquare,
    },
    {
      title: "Top Performer Today",
      value:
        typeof dynamicStats.topPerformerToday.value === "object" &&
        dynamicStats.topPerformerToday.value
          ? dynamicStats.topPerformerToday.value.name
          : dynamicStats.topPerformerToday.value,
      subtitle: dynamicStats.topPerformerToday.subtitle,
      change: dynamicStats.topPerformerToday.change + "/5.0",
      changeType: dynamicStats.topPerformerToday.changeType,
      icon: TrendingUp,
    },
    {
      title: "Negative Feedbacks",
      value: dynamicStats.negativeFeedbacks.today,
      change:
        dynamicStats.negativeFeedbacks.yesterday -
        dynamicStats.negativeFeedbacks.yesterday +
        " from yesterday",
      changeType: dynamicStats.negativeFeedbacks.changeType,
      icon: AlertTriangle,
    },
    {
      title: "Counselling Alerts",
      value: dynamicStats.counsellingAlerts,
      change:
        dynamicStats.counsellingAlerts > 0
          ? "Requires attention"
          : "No Attention Required",
      changeType: "warning",
      icon: Users,
    },
    {
      title: "Total Brands",
      value: dynamicStats.totalBrands,
      change: "Active brands",
      changeType: "positive",
      icon: Building2,
    },
    {
      title: "Total Locations",
      value: `${dynamicStats.totalStates} States, ${dynamicStats.totalCities} Cities`,
      change: "Coverage areas",
      changeType: "positive",
      icon: MapPin,
    },
    {
      title: "Total Outlets",
      value: dynamicStats.totalOutlets,
      change: "Active outlets",
      changeType: "positive",
      icon: Store,
    },
    {
      title: "Total Employees",
      value: dynamicStats.totalEmployees,
      change: "Active employees",
      changeType: "positive",
      icon: UserCheck,
    },
  ];

  const recentActivity = dynamicStats.recentActivity;
  console.log(stats);
  return (
    <AdminLayout topRightBarContent={isRefreshing ? "Loading Data..." : ""}>
      <div className="space-y-6 relative">
        {/* {isRefreshing?<span className=" p-1 px-4 rounded-md absolute -top-5 left-0">Loading Data...</span>:""} */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshData(true)}
              disabled={isRefreshing}
              style={{borderRadius: "var(--border-radius)"}}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.title}  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof stat.value === "object" && stat.value
                    ? stat.value.name
                    : stat.value}
                </div>
                {stat.subtitle && (
                  <div className="text-sm text-muted-foreground">
                    {stat.subtitle}
                  </div>
                )}
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "warning"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4"  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle>Recent Feedback Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity &&
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 "
                      style={{borderRadius: "var(--border-radius)"}}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100  flex items-center justify-center"  style={{borderRadius: "var(--border-radius)"}}>
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.employee}</p>
                          <p className="text-sm text-gray-500">
                            {activity.outlet}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            activity.rating >= 4
                              ? "default"
                              : activity.rating >= 3
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {activity.rating}/5
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3"  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  showLoading("Navigating to feedback links...");
                  setTimeout(() => {
                    hideLoading();
                    router.push("/admin/feedback-links");
                  }, 500);
                }}
                style={{borderRadius: "var(--border-radius)"}}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Feedback Links
              </Button>
              <Button
               style={{borderRadius: "var(--border-radius)"}}
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  showLoading("Loading performance report...");
                  setTimeout(() => {
                    hideLoading();
                    showToast("Performance report feature coming soon!", "info");
                  }, 1000);
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Performance Report
              </Button>
              <Button
               style={{borderRadius: "var(--border-radius)"}}
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  showLoading("Loading review alerts...");
                  setTimeout(() => {
                    hideLoading();
                    showToast("Review alerts feature coming soon!", "info");
                  }, 1000);
                }}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Review Alerts
              </Button>
              <Button
               style={{borderRadius: "var(--border-radius)"}}
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => {
                  showLoading("Navigating to employee management...");
                  setTimeout(() => {
                    hideLoading();
                    router.push("/admin/employees");
                  }, 500);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
