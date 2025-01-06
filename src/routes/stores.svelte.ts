import { writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import type { UUIDTypes } from "uuid";

export const store: {
  currentCategory: string;
  todos: Todo[];
  filteredTodos: Todo[];
  filteringCondition: (todo: Todo) => boolean;
} = $state({
  currentCategory: "All",
  todos: [],
  filteredTodos: [],
  filteringCondition: () => true,
});
export type Todo = {
  title: string;
  isImportant: boolean;
  wantsDate: boolean;
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
