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
  category?: string;
  dueDate?: string;
  dueTime?: string;
};

export const filterTodos = () => {
  store.filteredTodos = store.todos.filter(store.filteringCondition);
};
