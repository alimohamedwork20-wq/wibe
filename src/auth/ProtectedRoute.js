import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token"); // بنجيب التوكين من الكوكيز اللي أنت عملتها
  if (!token) {
    // لو مفيش توكين، بنرجعه لصفحة اللوجن
    return <Navigate to="/login" replace />;
  }

  // لو التوكين موجود، بنسمح له يشوف الصفحة (الـ children)
  return children;
};

export default ProtectedRoute;
