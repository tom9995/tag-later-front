import CardsList from "@/components/CardsList";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CardsPage() {
  return (
    <ProtectedRoute>
      <CardsList />
    </ProtectedRoute>
  );
}
