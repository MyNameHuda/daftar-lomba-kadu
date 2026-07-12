import { Navigate } from "react-router-dom";
import { useContest } from "@/context/ContestContext";

export function RouteGuard({ require = [], redirectTo = "/" }) {
  const { state } = useContest();

  const isValid = require.every((field) => {
    if (field === "contestName") return !!state.contestName;
    if (field === "category") return !!state.category;
    if (field === "participants") return state.participants.length > 0;
    return true;
  });

  if (!isValid) {
    return <Navigate to={redirectTo} replace />;
  }

  return null;
}
