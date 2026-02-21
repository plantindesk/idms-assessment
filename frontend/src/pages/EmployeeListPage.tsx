import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmployees } from "../hooks/useEmployees";
import EmployeeFilter from "../components/employee/EmployeeFilter";
import { employeeApi } from "../api/employeeApi";
import { Loader2, Plus, Pencil, Trash2, MoreHorizontal, Users, LayoutDashboard } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    employees,
    pagination,
    filters,
    isLoading,
    error,
    updateFilter,
    setPage,
    resetFilters,
    refetch,
  } = useEmployees();

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      await employeeApi.delete(employeeToDelete);
      refetch();
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch {
      alert("Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  const TableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="size-6" />
              Employee List
            </CardTitle>
            <CardDescription>
              Manage and view all employees in your organization
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/employees/create")}>
              <Plus className="size-4" />
              Add Employee
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmployeeFilter
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
          />

          {pagination && (
            <p className="text-sm text-muted-foreground">
              Showing {employees.length} of {pagination.totalEmployees} employees
            </p>
          )}

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading ? (
            <TableSkeleton />
          ) : employees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date of Joining</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp._id}>
                    <TableCell className="font-mono text-sm">{emp.uniqueId}</TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={
                            emp.profileImage
                              ? `${import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "")}${emp.profileImage}`
                              : "/placeholder-avatar.png"
                          }
                          alt={emp.name}
                        />
                        <AvatarFallback>
                          {emp.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.phone}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.status === "Active" ? "default" : "secondary"}
                        className={emp.status === "Active" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(emp.dateOfJoining).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/employees/edit/${emp._id}`)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDeleteClick(emp._id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No employees found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new employee.</p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="default"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPage(pagination.currentPage - 1)}
                    >
                      <ChevronLeftIcon className="size-4" />
                      Previous
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="flex h-9 items-center px-4 text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="default"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage(pagination.currentPage + 1)}
                    >
                      Next
                      <ChevronRightIcon className="size-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeeListPage;
