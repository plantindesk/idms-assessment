# IDMS Assessment - Frontend

A modern React-based admin dashboard for employee management, built with TypeScript, Vite, and shadcn/ui.

## Description

This is the frontend application for an Employee Management System (IDMS Assessment). It provides a complete interface for administrators to manage employees, including authentication, CRUD operations, filtering, sorting, and pagination. The application features a responsive design with a professional UI powered by shadcn/ui components.

### Key Features

- **Authentication**: Secure login system with protected routes and session management
- **Dashboard**: Overview with employee statistics (total, active, inactive, by department/designation)
- **Employee Management**: Full CRUD operations with profile image upload support
- **Advanced Filtering**: Filter employees by department, designation, gender, and status
- **Search & Sort**: Real-time search with debouncing and multi-column sorting
- **Pagination**: Efficient data loading with server-side pagination
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2.0 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 8.x (Beta) |
| **Styling** | Tailwind CSS 4.x |
| **UI Components** | shadcn/ui (New York style) |
| **Routing** | React Router 7.x |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **State Management** | React Context API |
| **Package Manager** | Bun |

## Prerequisites

Ensure you have the following installed:

- **Bun** >= 1.0.0 (recommended) or **Node.js** >= 18.0.0
- A running instance of the backend API server

## Installation

1. **Clone the repository** (if applicable):

```bash
git clone <repository-url>
cd idms-assessment/frontend
```

2. **Install dependencies** using Bun:

```bash
bun install
```

   Or using npm:

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_UPLOADS_BASE_URL=http://localhost:5000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the backend API | `http://localhost:5000/api/v1` |
| `VITE_UPLOADS_BASE_URL` | Base URL for serving uploaded files | `http://localhost:5000` |

## Usage

### Development Server

Start the development server with hot module replacement:

```bash
bun run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Production Build

Build the application for production:

```bash
bun run build
```

This runs TypeScript type checking followed by Vite's production build. Output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
bun run lint
```

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── api/                   # API service layer
│   │   ├── adminApi.ts        # Admin authentication endpoints
│   │   ├── axiosInstance.ts   # Configured Axios instance
│   │   └── employeeApi.ts     # Employee CRUD endpoints
│   ├── components/
│   │   ├── common/            # Shared components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── employee/          # Employee-specific components
│   │   │   └── EmployeeFilter.tsx
│   │   └── ui/                # shadcn/ui components
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── select.tsx
│   │       ├── sonner.tsx
│   │       └── table.tsx
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── AuthContextDef.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useEmployees.ts
│   ├── lib/                   # Utility libraries
│   │   └── utils.ts           # cn() utility for class merging
│   ├── pages/                 # Page components
│   │   ├── CreateEmployeePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EditEmployeePage.tsx
│   │   ├── EmployeeListPage.tsx
│   │   └── LoginPage.tsx
│   ├── types/                 # TypeScript type definitions
│   │   ├── admin.types.ts
│   │   └── employee.types.ts
│   ├── utils/                 # Utility functions & constants
│   │   └── constants.ts
│   ├── App.tsx                # Root component with routing
│   ├── index.css              # Global styles (Tailwind)
│   └── main.tsx               # Application entry point
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package.json
├── tsconfig.json              # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts             # Vite configuration
```

## API Integration

The frontend expects a RESTful API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Admin login |
| `GET` | `/employees` | List employees (with pagination/filters) |
| `GET` | `/employees/:id` | Get single employee |
| `POST` | `/employees` | Create employee (multipart/form-data) |
| `PUT` | `/employees/:id` | Update employee (multipart/form-data) |
| `DELETE` | `/employees/:id` | Delete employee |
| `GET` | `/employees/stats` | Get dashboard statistics |

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | LoginPage | Public |
| `/dashboard` | DashboardPage | Protected |
| `/employees` | EmployeeListPage | Protected |
| `/employees/create` | CreateEmployeePage | Protected |
| `/employees/edit/:id` | EditEmployeePage | Protected |
| `*` | Redirect to `/dashboard` | - |

## Adding New shadcn/ui Components

To add new UI components from shadcn/ui:

```bash
bunx shadcn@latest add <component-name>
```

Example:
```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add sheet
```

## Development Notes

- **Path Aliases**: The `@/` alias is configured to point to `./src/` for clean imports
- **React Compiler**: Babel plugin for React Compiler is enabled for automatic optimization
- **Authentication**: Uses HTTP-only cookies (`withCredentials: true`) for session management
- **401 Handling**: Automatic redirect to login on unauthorized responses

## License

This project is part of an assessment and is not licensed for public distribution.
