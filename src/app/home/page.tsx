import CardsList from "@/components/CardsList";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <CardsList />
    </ProtectedRoute>
  );
}
