import { writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { create as createSuite, test, enforce } from "vest";
import type { UUIDTypes } from "uuid";
import "vest/enforce/date";

export const store: {
  currentCategory: string;
  todos: Todo[];
  filteredTodos: Todo[];
  filteringCondition: (todo: Todo) => boolean;
  editedTodo: UUIDTypes | null;
} = $state({
  currentCategory: "All",
  todos: [],
  filteredTodos: [],
  editedTodo: null,
  filteringCondition: () => true,
});
export type Todo = {
  title: string;
  isImportant: boolean;
  uuid: UUIDTypes;
  category?: string;
  dueDate?: string;
  dueTime?: string;
};

export const filterTodos = () => {
  store.filteredTodos = store.todos.filter(store.filteringCondition);
};

export const writeTodos = async () => {
  await writeTextFile("remindee.json", JSON.stringify(store.todos), {
    baseDir: BaseDirectory.AppLocalData,
  });
};

export const todoSuite = createSuite((data: Todo) => {
  test("title", "Title cannot be blank", () => {
    enforce(data.title).isNotBlank();
  });

  test("dueDate", "Isn't in YYYY-MM-DD", () => {
    if (!data.dueDate) return true;
    enforce(data.dueDate).isDate({ format: "YYYY-MM-DD" });
  });

  test("dueTime", "Use HH:mm", () => {
    if (!data.dueTime) return true;
    enforce(data.dueTime).matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  });

  test("duplicates", "No duplicates", () => {
    return !store.todos.some(
      (todo) => JSON.stringify(todo) === JSON.stringify(data)
    );
  });
});
