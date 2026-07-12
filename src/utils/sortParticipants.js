import { SORT } from "@/constants";

export function sortParticipants(participants) {
  return [...participants].sort((a, b) => {
    if (a.age !== b.age) {
      return a.age - b.age;
    }
    return a.name.localeCompare(b.name, SORT.LOCALE, { sensitivity: "base" });
  });
}
