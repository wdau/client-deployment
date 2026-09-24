import { useState } from "react";
import "./App.css";
import { useTodos } from "./hooks/useTodos";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { todos, isLoading, isSaving, error, addTodo, toggleTodo, deleteTodo } =
    useTodos();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const wasAdded = await addTodo(title, description);
    if (wasAdded) {
      setTitle("");
      setDescription("");
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="app-shell">
      <section className="todo-panel" aria-labelledby="page-title">
        <header className="panel-header">
          <h1 id="page-title">Todo List</h1>
          <div
            className="progress-line"
            aria-label={`${completedCount} of ${todos.length} todos complete`}
          >
            <span>{completedCount} complete</span>
            <span>{todos.length} total</span>
          </div>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add a new todo"
              required
            />
          </label>
          <label>
            <span>Description</span>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does it involve?"
              required
            />
          </label>
          <button className="add-button" type="submit" disabled={isSaving}>
            {isSaving ? "Adding..." : "Add todo"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="empty-state">Loading your todos...</p>
        ) : todos.length === 0 ? (
          <p className="empty-state">
            Nothing here yet. Add your first todo above.
          </p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                className={`todo-item ${todo.completed ? "completed" : ""}`}
                key={todo._id}
              >
                <div className="todo-copy">
                  <strong>{todo.title}</strong>
                  <span>{todo.description}</span>
                </div>
                <div className="todo-actions">
                  <button type="button" onClick={() => toggleTodo(todo)}>
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
