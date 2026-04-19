import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SchedulePage from './pages/SchedulePage';
import CourseDetailPage from './pages/CourseDetailPage';
import NewCoursePage from './pages/NewCoursePage';
import EditCoursePage from './pages/EditCoursePage';

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Stage 1: teacher CRUD pages */}
            <Route path="/courses/new" element={<NewCoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/edit" element={<EditCoursePage />} />

            {/* Stage 2 (already built, mocked): student auth + schedule */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CoursesProvider>
    </AuthProvider>
  );
}

export default App;
