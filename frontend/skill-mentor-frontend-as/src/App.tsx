import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PaymentPage from "@/pages/PaymentPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import CreateSubjectPage from "@/pages/admin/CreateSubjectPage";
import CreateMentorPage from "@/pages/admin/CreateMentorPage";
import ManageBookingsPage from "@/pages/admin/ManageBookingsPage";
import MentorProfilePage from "@/pages/MentorProfilePage";
import AuthRedirect from "@/components/AuthRedirect";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/redirect-after-auth"
            element={<AuthRedirect />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:sessionId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route path="/mentors/:mentorId" element={<MentorProfilePage />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="subjects/create" element={<CreateSubjectPage />} />
            <Route path="mentors/create" element={<CreateMentorPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
          </Route>

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;