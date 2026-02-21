import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { employeeApi } from "@/api/employeeApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  byDepartment: { _id: string; count: number }[];
  byDesignation: { _id: string; count: number }[];
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await employeeApi.getStats();
        setStats(response.data.stats);
      } catch {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-32 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/employees")}>
            View All Employees
          </Button>
          <Button onClick={() => navigate("/employees/create")}>
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmployees ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.activeEmployees ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.inactiveEmployees ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Employees by Department</CardTitle>
            </div>
            <CardDescription>Distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.byDepartment && stats.byDepartment.length > 0 ? (
              <div className="space-y-3">
                {stats.byDepartment.map((dept) => (
                  <div key={dept._id} className="flex items-center justify-between">
                    <span className="text-sm">{dept._id}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (dept.count / (stats?.totalEmployees || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium">
                        {dept.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No department data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>Employees by Designation</CardTitle>
            </div>
            <CardDescription>Distribution across designations</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.byDesignation && stats.byDesignation.length > 0 ? (
              <div className="space-y-3">
                {stats.byDesignation.map((desig) => (
                  <div key={desig._id} className="flex items-center justify-between">
                    <span className="text-sm">{desig._id}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (desig.count / (stats?.totalEmployees || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium">
                        {desig.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No designation data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
