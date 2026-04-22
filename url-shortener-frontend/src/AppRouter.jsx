import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import ShortenUrlPage from "./pages/ShortenUrlPage";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PricingPage from "./pages/PricingPage";

const AppRouter = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith("/s");

    return (
        <>
        {!hideHeaderFooter && <Navbar /> }
        <Toaster position='bottom-center'/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/s/:url" element={<ShortenUrlPage />} />
          
          <Route path="/pricing" element={<PricingPage />} />

          <Route path="/register" element={<PrivateRoute publicPage={true}><RegisterPage /></PrivateRoute>} />
          <Route path="/login" element={<PrivateRoute publicPage={true}><LoginPage /></PrivateRoute>} />
          
          <Route path="/dashboard" element={ <PrivateRoute publicPage={false}><DashboardLayout /></PrivateRoute>} />
          
          <Route path="/admin" element={ <AdminRoute><AdminDashboard /></AdminRoute>} />
          
          <Route path="/error" element={ <ErrorPage />} />
          <Route path="*" element={ <ErrorPage message="We can't seem to find the page you're looking for"/>} />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </>
    );
}

export default AppRouter;

export const SubDomainRouter = () => {
    return (
        <Routes>
          <Route path="/:url" element={<ShortenUrlPage />} />
        </Routes>
    )
}