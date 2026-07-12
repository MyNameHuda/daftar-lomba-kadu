import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { useToast } from "@/hooks/useToast";
import { CATEGORIES } from "@/constants/categories";
import { CategoryCard } from "@/components/contest/CategoryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants/routes";
import { CONTEST_ACTIONS } from "@/context/ContestContext";

export default function CategoryPage() {
  const { state, dispatch } = useContest();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSelect = (categoryId) => {
    if (state.category !== categoryId) {
      dispatch({ type: CONTEST_ACTIONS.SET_CATEGORY, payload: categoryId });
    }
  };

  const handleContinue = () => {
    if (!state.category) {
      toast.warning("Pilih kategori terlebih dahulu");
      return;
    }
    navigate(ROUTES.PARTICIPANTS);
  };

  return (
    <div>
      <PageHeader
        title="Pilih Kategori"
        subtitle={`Lomba: ${state.contestName}`}
        backTo={ROUTES.HOME}
      />

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              selected={state.category === cat.id}
              onClick={() => handleSelect(cat.id)}
            />
          ))}
        </div>
      </Card>

      <Button
        fullWidth
        size="lg"
        disabled={!state.category}
        onClick={handleContinue}
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Mulai Input Peserta
      </Button>
    </div>
  );
}
