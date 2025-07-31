"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, RefreshCw, Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardEntry {
  id: number;
  name: string;
  photo: string;
  outlet: string;
  brand: string;
  city: string;
  state: string;
  averageRating: number;
  totalReviews: number;
  status: "Perfect" | "Good" | "Needs Improvement";
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [summary, setSummary] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    outlet: "",
    city: "",
    state: "",
    brand: "",
    duration: "month", // or "period" as per your backend
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    let url = `/api/leaderboard?period=${filters.duration}`;
    // Add more query params as needed (outletId, brandId, etc.)
    const res = await fetch(url);
    const json = await res.json();
    if (json.success) {
      setLeaderboardData(
        json.data.leaderboard.map((entry: any, idx: number) => ({
          id: entry.id,
          name: entry.employee_name, // <-- Fix here
          photo: entry.photo || "/placeholder.svg",
          outlet: entry.outlet_name,
          brand: entry.brand_name,
          city: entry.city_name,
          state: entry.state_name,
          averageRating: Number(entry.average_rating),
          totalReviews: Number(entry.total_reviews),
          status:
            entry.average_rating >= 4.5
              ? "Perfect"
              : entry.average_rating >= 4
              ? "Good"
              : "Needs Improvement",
          rank: idx + 1,
        }))
      );
      setSummary(json.data.summary);
      setTopPerformers(json.data.topPerformers);
      setLastUpdated(new Date(json.data.lastUpdated));
    }
  };
  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  // Mock data for filters
  const outlets = [
    "Downtown Store",
    "Mall Branch",
    "Airport Terminal",
    "City Center",
  ];
  const cities = ["Los Angeles", "San Francisco", "New York City", "Houston"];
  const states = ["California", "New York", "Texas", "Florida"];
  const brands = [
    "Premium Coffee",
    "Quick Bites",
    "Fresh Market",
    "Tech Store",
  ];

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshLeaderboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      fetchLeaderboard();
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredData = leaderboardData.filter((entry) => {
    return (
      (!filters.outlet || entry.outlet === filters.outlet) &&
      (!filters.city || entry.city === filters.city) &&
      (!filters.state || entry.state === filters.state) &&
      (!filters.brand || entry.brand === filters.brand)
    );
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Perfect":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Needs Improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center txet-primary justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Leaderboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button  style={{borderRadius: "var(--border-radius)"}}
              variant="outline"
              size="sm"
              onClick={refreshLeaderboard}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={filters.duration}
                  onValueChange={(value) =>
                    setFilters({ ...filters, duration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) =>
                    setFilters({ ...filters, brand: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  value={filters.state}
                  onValueChange={(value) =>
                    setFilters({ ...filters, state: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select
                  value={filters.city}
                  onValueChange={(value) =>
                    setFilters({ ...filters, city: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Outlet</Label>
                <Select
                  value={filters.outlet}
                  onValueChange={(value) =>
                    setFilters({ ...filters, outlet: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Outlets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Outlets</SelectItem>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet} value={outlet}>
                        {outlet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button  style={{borderRadius: "var(--border-radius)"}}
                variant="outline"
                onClick={() =>
                  setFilters({
                    outlet: "",
                    city: "",
                    state: "",
                    brand: "",
                    duration: "monthly",
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Performers */}
        <div className="grid gap-4 md:grid-cols-3">
          {filteredData.slice(0, 3).map((employee, index) => (
            <Card  style={{borderRadius: "var(--border-radius)"}}
              key={employee.id}
              className={`${index === 0 ? "ring-2 ring-yellow-400" : ""}`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getRankIcon(employee.rank)}
                </div>
                <Avatar className="h-16 w-16 mx-auto mb-2">
                  <AvatarImage src={employee.photo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {(employee.name || "")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{employee.name}</CardTitle>
                <p className="text-sm text-gray-500">{employee.outlet}</p>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex justify-center items-center space-x-1">
                  {getRatingStars(employee.averageRating)}
                  <span className="ml-2 font-bold">
                    {employee.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {employee.totalReviews} reviews
                </p>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>
              Complete Rankings ({filteredData.length} employees)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    employee.rank <= 3
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100"
                      : "bg-gray-50"
                  }`}
                  style={{borderRadius: "var(--border-radius)"}}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {employee.rank <= 3 ? (
                        getRankIcon(employee.rank)
                      ) : (
                        <span className="font-bold text-gray-500">
                          #{employee.rank}
                        </span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarImage src={employee.photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {(employee.name || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-gray-500">
                        {employee.outlet} • {employee.brand}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.city}, {employee.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(employee.averageRating)}
                      </div>
                      <p className="text-sm font-bold">
                        {employee.averageRating.toFixed(1)}/5.0
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{employee.totalReviews}</p>
                      <p className="text-sm text-gray-500">reviews</p>
                    </div>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData[0]?.name}</div>
              <p className="text-sm text-gray-500">
                {filteredData[0]?.averageRating.toFixed(1)}/5.0 rating
              </p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  filteredData.reduce(
                    (sum, emp) => sum + emp.averageRating,
                    0
                  ) / filteredData.length
                ).toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">Across all employees</p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredData.reduce((sum, emp) => sum + emp.totalReviews, 0)}
              </div>
              <p className="text-sm text-gray-500">
                This {filters.duration.replace("-", " ")}
              </p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Perfect Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter((emp) => emp.status === "Perfect").length}
              </div>
              <p className="text-sm text-gray-500">
                Out of {filteredData.length} employees
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
