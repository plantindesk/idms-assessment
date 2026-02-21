import { useState, type SubmitEvent, type ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { employeeApi } from "@/api/employeeApi";
import type { Employee } from "@/types/employee.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserPen, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  GENDER_OPTIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  STATUS_OPTIONS,
  COURSE_OPTIONS,
} from "@/utils/constants";

interface FormState {
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  designation: string;
  status: string;
  courses: string[];
  dateOfJoining: string;
  salary: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  department: "",
  designation: "",
  status: "",
  courses: [],
  dateOfJoining: "",
  salary: "",
};

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        navigate("/employees");
        return;
      }

      try {
        const response = await employeeApi.getById(id);
        const emp: Employee = response.data.employee;
        setForm({
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          gender: emp.gender,
          department: emp.department,
          designation: emp.designation,
          status: emp.status,
          courses: emp.courses || [],
          dateOfJoining: new Date(emp.dateOfJoining).toISOString().split("T")[0],
          salary: emp.salary.toString(),
        });
        setExistingImage(emp.profileImage || null);
      } catch {
        toast.error("Failed to load employee data");
        navigate("/employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (course: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      courses: checked
        ? [...prev.courses, course]
        : prev.courses.filter((c) => c !== course),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setExistingImage(null);
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);
      formData.append("department", form.department);
      formData.append("designation", form.designation);
      formData.append("status", form.status);
      formData.append("dateOfJoining", form.dateOfJoining);
      formData.append("salary", form.salary);
      form.courses.forEach((course) => {
        formData.append("courses", course);
      });
      if (profileImage) {
        formData.append("profileImage", profileImage);
      } else if (existingImage) {
        formData.append("existingProfileImage", existingImage);
      }

      await employeeApi.update(id!, formData);
      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to update employee. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/employees")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPen className="h-6 w-6" />
            <CardTitle>Edit Employee</CardTitle>
          </div>
          <CardDescription>
            Update employee information
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (10 digits) *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="1234567890"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={form.department}
                onValueChange={(value) => handleSelectChange("department", value)}
                required
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Select
                value={form.designation}
                onValueChange={(value) => handleSelectChange("designation", value)}
                required
              >
                <SelectTrigger id="designation">
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATION_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Courses *</Label>
              <div className="grid grid-cols-2 gap-2">
                {COURSE_OPTIONS.map((course) => (
                  <label
                    key={course}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={form.courses.includes(course)}
                      onCheckedChange={(checked) =>
                        handleCourseChange(course, checked as boolean)
                      }
                    />
                    {course}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfJoining">Date of Joining *</Label>
              <Input
                id="dateOfJoining"
                name="dateOfJoining"
                type="date"
                value={form.dateOfJoining}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                placeholder="50000"
                value={form.salary}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              {existingImage && (
                <p className="text-sm text-muted-foreground">
                  Current image: {existingImage.split("/").pop()}
                </p>
              )}
              <Input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {existingImage && (
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep the current image
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/employees")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Employee"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default EditEmployeePage;
