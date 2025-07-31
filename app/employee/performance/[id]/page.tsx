"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, TrendingUp, MessageSquare, Award, Calendar, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useEffect, useState } from "react";

export default function EmployeePerformancePage({ params }: { params: { id: string } }) {
  const employeeId = params.id;
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [performanceStatus, setPerformanceStatus] = useState<string>("");
  const [positiveReviewPercent, setPositiveReviewPercent] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [topPercentile, setTopPercentile] = useState<number | null>(null);

  // Fetch and apply theme
  useEffect(() => {
    if (!themeData?.success || !themeData?.settings) return;

    const s = themeData.settings;
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty("--primary-color", s.primary_color || "#10b981");
    root.style.setProperty("--secondary-color", s.secondary_color || "#047857");
    root.style.setProperty("--accent-color", s.accent_color || "#34d399");
    root.style.setProperty("--background-color", s.background_color || "#ffffff");
    root.style.setProperty("--text-color", s.text_color || "#000000");
    root.style.setProperty("--sidebar-color", s.sidebar_color || "#1e293b");
    root.style.setProperty("--header-color", s.header_color || "#2563eb");
    root.style.setProperty("--font-family", s.font_family || "Poppins, sans-serif");
    root.style.setProperty("--font-size", s.font_size || "16px");
    root.style.setProperty("--border-radius", s.border_radius || "8px");
    root.style.setProperty("--shadow-intensity", s.shadow_intensity || "md");

    // Handle dark mode
    if (s.dark_mode_enabled === 1 || s.dark_mode_enabled === true) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Inject custom CSS (if present)
    const styleId = "custom-css-theme";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = s.custom_css || "";
  }, [themeData]);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/api/employees/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployeeData(data.data);
        }
        setLoading(false);
      });
  }, [employeeId]);

  // Fetch reviews for the employee
  useEffect(() => {
    if (!employeeId) return;
    setReviewsLoading(true);
    fetch(`/api/employees/${employeeId}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.data);
          // Process reviews to generate performance data by month
          const monthMap: { [key: string]: { month: string; year: number; ratings: number[]; reviews: number } } = {};
          data.data.forEach((review: any) => {
            const date = new Date(review.date);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${year}-${month}`;
            if (!monthMap[key]) {
              monthMap[key] = { month, year, ratings: [], reviews: 0 };
            }
            monthMap[key].ratings.push(review.rating);
            monthMap[key].reviews += 1;
          });
          // Sort by year and month ascending
          const sorted = Object.values(monthMap).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
          });
          // Map to chart data
          const chartData = sorted.map(({ month, ratings, reviews }) => ({
            month,
            rating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0,
            reviews
          }));
          setPerformanceData(chartData);
          // Calculate performance status from all reviews
          if (data.data.length > 0) {
            const avgRatingVal = data.data.reduce((sum: number, r: any) => sum + r.rating, 0) / data.data.length;
            setAvgRating(avgRatingVal);
            const positiveCount = data.data.filter((r: any) => r.rating >= 4).length;
            setPositiveReviewPercent(Math.round((positiveCount / data.data.length) * 100));
            if (avgRatingVal <= 3) {
              setPerformanceStatus("Needs Review");
            } else if (avgRatingVal > 4) {
              setPerformanceStatus("Perfect");
            } else {
              setPerformanceStatus("Good");
            }
          } else {
            setPerformanceStatus("No Reviews");
            setAvgRating(null);
            setPositiveReviewPercent(null);
          }
        } else {
          setReviewsError("Failed to fetch reviews.");
        }
        setReviewsLoading(false);
      })
      .catch(() => {
        setReviewsError("Failed to fetch reviews.");
        setReviewsLoading(false);
      });
  }, [employeeId]);

  // Fetch all employees' average ratings and determine the nearest 10% bracket for this employee
  useEffect(() => {
    if (avgRating === null || !employeeId) return;
    fetch('/api/employees/averageReviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Filter out null avg_rating and sort descending
          const ratings = data.data
            .filter((e: any) => e.avg_rating !== null)
            .map((e: any) => ({ id: e.id, avg_rating: Number(e.avg_rating) }))
            .sort((a: any, b: any) => b.avg_rating - a.avg_rating);
          if (ratings.length === 0) {
            setTopPercentile(null);
            return;
          }
          // Find this employee's index in the sorted list
          const thisEmpIndex = ratings.findIndex(e => String(e.id) === String(employeeId));
          if (thisEmpIndex === -1) {
            setTopPercentile(null);
            return;
          }
          // Calculate percentile (1-based)
          const percentile = ((thisEmpIndex + 1) / ratings.length) * 100;
          // Nearest 10% (e.g., 10, 20, ...)
          const nearest10 = Math.ceil(percentile / 10) * 10;
          setTopPercentile(nearest10);
        } else {
          setTopPercentile(null);
        }
      })
      .catch(() => setTopPercentile(null));
  }, [avgRating, employeeId]);

  // Mock recent feedback
  // const recentFeedback = [
  //   {
  //     id: 1,
  //     customerName: "Alice Johnson",
  //     rating: 5,
  //     comment: "Excellent service! John was very helpful and friendly.",
  //     date: "2024-01-20",
  //     status: "Perfect",
  //   },
  //   {
  //     id: 2,
  //     customerName: "Bob Smith",
  //     rating: 4,
  //     comment: "Good service, quick and efficient.",
  //     date: "2024-01-19",
  //     status: "Perfect",
  //   },
  //   {
  //     id: 3,
  //     customerName: "Carol Davis",
  //     rating: 5,
  //     comment: "Amazing experience! Will definitely come back.",
  //     date: "2024-01-18",
  //     status: "Perfect",
  //   },
  //   {
  //     id: 4,
  //     customerName: "David Brown",
  //     rating: 3,
  //     comment: "Average service, could be improved.",
  //     date: "2024-01-17",
  //     status: "Needs Review",
  //   },
  // ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Perfect":
        return "bg-green-100 text-green-800"
      case "Needs Counselling":
        return "bg-red-100 text-red-800"
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  // Helper for current month/year
  function isCurrentMonth(date: Date) {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  // Calculate dynamic goals
  const maintainHighRatingAchieved = avgRating !== null && avgRating >= 4.8;
  const reviewsThisMonth = reviews.filter(r => isCurrentMonth(new Date(r.date))).length;
  const reviewsThisMonthAchieved = reviewsThisMonth >= 30;
  const zeroNegativeFeedbackAchieved = reviews.length > 0 && reviews.every(r => r.rating > 2);

  // Calculate dynamic achievements
  let topPerformerMonth: string | null = null;
  let customerFavoriteMonth: string | null = null;
  let mostImprovedMonth: string | null = null;
  if (performanceData.length > 0) {
    // Top Performer: any month with avg rating >= 4.9
    const topMonth = performanceData.find(m => m.rating >= 4.9);
    if (topMonth) topPerformerMonth = topMonth.month;
    // Customer Favorite: any month with positive review percent >= 90%
    const favMonth = performanceData.find(m => m.reviews > 0 && (m.rating >= 4.5) && ((m.rating / 5) * 100 >= 90));
    if (favMonth) customerFavoriteMonth = favMonth.month;
    // Most Improved: rating increased by >= 0.5 from previous to current month
    for (let i = 1; i < performanceData.length; i++) {
      if (performanceData[i].rating - performanceData[i - 1].rating >= 0.5) {
        mostImprovedMonth = performanceData[i].month;
        break;
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!employeeData) {
    return <div className="text-center py-8">Employee data not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white ">
      {/* Header */}
      <div className="bg-white shadow-sm border-b  dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 ">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employeeData.photo_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                {employeeData.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{employeeData.full_name}</h1>
              <p className="text-gray-600">
                {employeeData.position} <span className={employeeData.status=="Active" ? `text-green-500` : `text-red-500`}>•</span> {employeeData.outlet_name}
              </p>
              <p className="text-sm text-gray-500">{employeeData.brand}</p>
            </div>
            <div className="ml-auto">
              <Badge className={getStatusColor(performanceStatus)} variant="secondary">
                {performanceStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating !== null ? avgRating.toFixed(1) : "-"}</div>
                <div className="flex items-center mt-1">{getRatingStars(Math.floor(avgRating || 0))}</div>
                <p className="text-xs text-muted-foreground">Out of 5.0</p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-xs text-muted-foreground">+{reviews.length} this period</p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{positiveReviewPercent !== null ? `${positiveReviewPercent}%` : "-"}</div>
                <p className="text-xs text-muted-foreground">Rating ≥ 4</p>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top {topPercentile ? topPercentile : "-"}%</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${topPercentile && topPercentile <= 10 ? "text-purple-600" : "text-gray-600"}`}>
                  {topPercentile ? `Top ${topPercentile}%` : "-"}
                </div>
                <p className="text-xs text-muted-foreground">Company Wide</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle>Rating Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle>Monthly Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reviews" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Status Indicator */}
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Performance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center justify-between p-4 rounded-lg border ${performanceStatus === "Perfect" ? "bg-green-50 border-green-200" : performanceStatus === "Needs Review" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}>
                <div>
                  <h3 className={`font-semibold ${performanceStatus === "Perfect" ? "text-green-800" : performanceStatus === "Needs Review" ? "text-yellow-800" : "text-gray-800"}`}>
                    {performanceStatus === "Perfect"
                      ? "Perfect Performance!"
                      : performanceStatus === "Needs Review"
                        ? "Needs Review"
                        : performanceStatus === "Good"
                          ? "Good Performance"
                          : "No Reviews Yet"}
                  </h3>
                  <p className={`text-sm ${performanceStatus === "Perfect" ? "text-green-600" : performanceStatus === "Needs Review" ? "text-yellow-600" : "text-gray-600"}`}>
                    {performanceStatus === "Perfect"
                      ? "You're maintaining excellent customer satisfaction. Keep up the great work!"
                      : performanceStatus === "Needs Review"
                        ? "Performance needs improvement. Please review feedback."
                        : performanceStatus === "Good"
                          ? "You're doing well, but there's room for improvement."
                          : "No feedback available yet."}
                  </p>
                </div>
                <div className="text-4xl">{performanceStatus === "Perfect" ? "🌟" : performanceStatus === "Needs Review" ? "⚠️" : "👍"}</div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Positive Reviews</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.8+</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Top {topPercentile}%</div>
                  <div className="text-sm text-gray-600">Company Wide</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Feedback */}
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle>Recent Customer Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="text-center py-4">Loading reviews...</div>
              ) : reviewsError ? (
                <div className="text-center py-4 text-red-500">{reviewsError}</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No reviews found.</div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 4).map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{feedback.customer_name}</span>
                          <div className="flex items-center">{getRatingStars(feedback.rating)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(feedback.status)} variant="secondary">
                            {feedback.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals and Achievements */}
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle>Goals & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Current Goals</h4>
                  <div className="space-y-3 ">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <span>Maintain 4.8+ rating</span>
                      <Badge variant="secondary" className={maintainHighRatingAchieved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {maintainHighRatingAchieved ? "✓ Achieved" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <span>30+ reviews this month</span>
                      <Badge variant="secondary" className={reviewsThisMonthAchieved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {reviewsThisMonthAchieved ? "✓ Achieved" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <span>Zero negative feedback</span>
                      <Badge variant="secondary" className={zeroNegativeFeedbackAchieved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {zeroNegativeFeedbackAchieved ? "✓ Achieved" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recent Achievements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg dark:bg-gray-800">
                      <Award className="h-6 w-6 text-yellow-600" />
                      <div>
                        <div className="font-medium">Top Performer</div>
                        <div className="text-sm text-gray-600">{topPerformerMonth ? topPerformerMonth : "-"}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg dark:bg-gray-800">
                      <Star className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">Customer Favorite</div>
                        <div className="text-sm text-gray-600">{customerFavoriteMonth ? customerFavoriteMonth : "-"}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg dark:bg-gray-800  ">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-medium">Most Improved</div>
                        <div className="text-sm text-gray-600">{mostImprovedMonth ? mostImprovedMonth : "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
