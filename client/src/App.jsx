import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from './pages/CourseDetailPage';
import NewCoursePage from './pages/NewCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import SchedulePage from './pages/SchedulePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoursesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses/new" element={<NewCoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/edit" element={<EditCoursePage />} />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CoursesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
