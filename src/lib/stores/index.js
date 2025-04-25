import { create } from "zustand";

export const useTodoStore = create((set) => ({
	todos: [],
	setTodos: (todosDataOrUpdater) =>
		set((state) => ({
			todos:
				typeof todosDataOrUpdater === "function"
					? todosDataOrUpdater(state.todos)
					: todosDataOrUpdater,
		})),
}));

export const useSessionStore = create((set) => ({
	session: {},
	setSession: (sessionDataOrUpdater) =>
		set((state) => ({
			session:
				typeof sessionDataOrUpdater === "function"
					? sessionDataOrUpdater(state.session)
					: sessionDataOrUpdater,
		})),
}));
