import ProtectedRoute from "../../components/ProtectedRoute";
import Home from "../../views/home";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
