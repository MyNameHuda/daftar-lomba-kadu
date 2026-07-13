import { useNavigate } from "react-router-dom";
import { useContest, CONTEST_ACTIONS } from "@/context/ContestContext";
import { SUB_CATEGORIES } from "@/constants/subCategories";
import { CategoryCard } from "@/components/contest/CategoryCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants/routes";

export default function SubCategoryPage() {
  const { state, dispatch } = useContest();
  const navigate = useNavigate();

  const handleSelect = (subId) => {
    dispatch({
      type: CONTEST_ACTIONS.SET_SUB_CATEGORY,
      payload: subId,
    });
    navigate(ROUTES.PARTICIPANTS);
  };

  return (
    <div>
      <PageHeader
        title="Pilih Sub Kategori"
        subtitle={`Lomba: ${state.contestName} · Kategori Anak`}
        backTo={ROUTES.CATEGORY}
      />

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUB_CATEGORIES.map((sub) => (
            <CategoryCard
              key={sub.id}
              category={sub}
              selected={state.subCategory === sub.id}
              onClick={() => handleSelect(sub.id)}
            />
          ))}
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center">
        Klik salah satu untuk langsung masuk ke halaman input peserta.
      </p>
    </div>
  );
}
