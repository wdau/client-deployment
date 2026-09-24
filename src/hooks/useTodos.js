import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ;

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTodos() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Unable to load your todos.");
      setTodos(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(title, description) {
    if (!title.trim() || !description.trim()) return false;

    try {
      setIsSaving(true);
      setError("");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error("Unable to add this todo.");
      await loadTodos();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleTodo(todo) {
    try {
      setError("");
      const response = await fetch(`${apiUrl}/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("Unable to update this todo.");
      await loadTodos();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteTodo(id) {
    try {
      setError("");
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete this todo.");
      await loadTodos();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return {
    todos,
    isLoading,
    isSaving,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
