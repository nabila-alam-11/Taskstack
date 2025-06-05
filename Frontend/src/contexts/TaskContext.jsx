import { createContext, useContext } from "react";

const TaskContext = createContext();

const useTaskContext = () => useContext(TaskContext);

export default useTaskContext;

export function TaskProvider({ children }) {
  const addTask = async (newTask) => {
    try {
      const response = await fetch(
        "https://workasana-backend-eight.vercel.app/v1/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task.");
      }

      const addedTask = await response.json();
      return addedTask;
    } catch (error) {
      throw error;
    }
  };
  const updateTaskStatus = async (taskId, updatedData) => {
    try {
      const response = await fetch(
        `https://workasana-backend-eight.vercel.app/v1/tasks/${taskId}/update-task-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed Status: ${response.status}`
        );
      }

      const updatedTask = await response.json();
      return updatedTask;
    } catch (error) {
      throw error;
    }
  };
  return (
    <TaskContext.Provider value={{ addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
}
