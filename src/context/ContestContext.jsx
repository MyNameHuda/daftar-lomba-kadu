import { createContext, useContext, useMemo } from "react";
import { usePersistentReducer } from "@/hooks/usePersistentReducer";
import { sortParticipants } from "@/utils/sortParticipants";
import { getCategoryById } from "@/constants/categories";

export const ContestStateContext = createContext(null);
export const ContestDispatchContext = createContext(null);

export const CONTEST_ACTIONS = {
  HYDRATE: "HYDRATE",
  SET_CONTEST_NAME: "SET_CONTEST_NAME",
  SET_CATEGORY: "SET_CATEGORY",
  ADD_PARTICIPANT: "ADD_PARTICIPANT",
  EDIT_PARTICIPANT: "EDIT_PARTICIPANT",
  DELETE_PARTICIPANT: "DELETE_PARTICIPANT",
  RESET: "RESET",
  CLEAR_PARTICIPANTS: "CLEAR_PARTICIPANTS",
};

export const INITIAL_CONTEST_STATE = {
  contestName: null,
  category: null,
  participants: [],
};

export function contestReducer(state, action) {
  switch (action.type) {
    case CONTEST_ACTIONS.HYDRATE:
      return { ...INITIAL_CONTEST_STATE, ...action.payload };

    case CONTEST_ACTIONS.SET_CONTEST_NAME:
      return { ...state, contestName: action.payload };

    case CONTEST_ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload };

    case CONTEST_ACTIONS.ADD_PARTICIPANT: {
      const next = [
        ...state.participants,
        {
          id: action.payload.id,
          name: action.payload.name,
          age: action.payload.age,
        },
      ];
      return { ...state, participants: sortParticipants(next) };
    }

    case CONTEST_ACTIONS.EDIT_PARTICIPANT: {
      const next = state.participants.map((p) =>
        p.id === action.payload.id
          ? { ...p, name: action.payload.name, age: action.payload.age }
          : p
      );
      return { ...state, participants: sortParticipants(next) };
    }

    case CONTEST_ACTIONS.DELETE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.filter(
          (p) => p.id !== action.payload
        ),
      };

    case CONTEST_ACTIONS.CLEAR_PARTICIPANTS:
      return { ...state, participants: [] };

    case CONTEST_ACTIONS.RESET:
      return INITIAL_CONTEST_STATE;

    default:
      return state;
  }
}

export function ContestProvider({ children }) {
  const [state, dispatch] = usePersistentReducer(
    contestReducer,
    INITIAL_CONTEST_STATE
  );

  const value = useMemo(() => {
    const meta = state.category ? getCategoryById(state.category) : null;
    return {
      ...state,
      categoryMeta: meta,
      ageRange: meta ? { min: meta.ageMin, max: meta.ageMax } : null,
      totalParticipants: state.participants.length,
    };
  }, [state]);

  return (
    <ContestStateContext.Provider value={value}>
      <ContestDispatchContext.Provider value={dispatch}>
        {children}
      </ContestDispatchContext.Provider>
    </ContestStateContext.Provider>
  );
}

export function useContest() {
  const state = useContext(ContestStateContext);
  const dispatch = useContext(ContestDispatchContext);
  if (!state || !dispatch) {
    throw new Error("useContest must be used within ContestProvider");
  }
  return { state, dispatch };
}
