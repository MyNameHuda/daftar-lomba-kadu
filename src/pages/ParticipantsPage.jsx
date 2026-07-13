import { useNavigate } from "react-router-dom";
import { ArrowRight, Edit3 } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryLabel } from "@/constants/subCategories";
import { ParticipantForm } from "@/components/contest/ParticipantForm";
import { ParticipantTable } from "@/components/contest/ParticipantTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export default function ParticipantsPage() {
  const { state } = useContest();
  const navigate = useNavigate();
  const meta = getCategoryById(state.category);

  const parts = [state.contestName, meta?.label];
  if (state.subCategory) parts.push(getSubCategoryLabel(state.subCategory));
  if (state.category && getCategoryAgeLabel(state.category)) {
    parts.push(`(${getCategoryAgeLabel(state.category)})`);
  }
  const subtitle = parts.filter(Boolean).join(" · ");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Input Peserta"
        subtitle={subtitle}
        backTo={
          state.category === "anak" ? ROUTES.SUB_CATEGORY : ROUTES.CATEGORY
        }
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              navigate(
                state.category === "anak"
                  ? ROUTES.SUB_CATEGORY
                  : ROUTES.CATEGORY
              )
            }
            icon={<Edit3 className="h-4 w-4" />}
            className="hidden sm:inline-flex"
          >
            Ganti
          </Button>
        }
      />

      <ParticipantForm />
      <ParticipantTable />

      {state.participants.length > 0 ? (
        <div className="pt-2">
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={() => navigate(ROUTES.RESULT)}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Selesai ({state.participants.length} peserta)
          </Button>
        </div>
      ) : null}
    </div>
  );
}
