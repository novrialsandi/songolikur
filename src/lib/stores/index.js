import { create } from "zustand";

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

export const useUsersStore = create((set) => ({
	users: [],
	setUsers: (usersDataOrUpdater) =>
		set((state) => ({
			users:
				typeof usersDataOrUpdater === "function"
					? usersDataOrUpdater(state.users)
					: usersDataOrUpdater,
		})),
}));

export const useCollectionSelectedStore = create((set) => ({
	collectionSelected: "",
	setCollectionSelected: (collectionSelectedDataOrUpdater) =>
		set((state) => ({
			collectionSelected:
				typeof collectionSelectedDataOrUpdater === "function"
					? collectionSelectedDataOrUpdater(state.collectionSelected)
					: collectionSelectedDataOrUpdater,
		})),
}));
