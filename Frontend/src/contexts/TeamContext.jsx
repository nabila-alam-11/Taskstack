import { createContext, useContext } from "react";

const TeamContext = createContext();

const useTeamContext = () => useContext(TeamContext);

export default useTeamContext;

export function TeamProvider({ children }) {
  const addTeam = async (newTeam) => {
    try {
      const response = await fetch(
        "https://workasana-backend-eight.vercel.app/v1/teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTeam),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new error(errorData.message || "Failed to add team.");
      }

      const addedTeam = await response.json();
      return addedTeam;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
  return (
    <TeamContext.Provider value={{ addTeam }}>{children}</TeamContext.Provider>
  );
}
