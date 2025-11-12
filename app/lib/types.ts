// Тип користувача (відповідно до моделі User)
export interface User {
    _id: string;
    email: string;
    username: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}

// Тип нотатки (відповідно до моделі Note)
export interface Note {
    _id: string;
    userId: string;
    title: string;
    content: string;
    tag: string;
    createdAt: string;
    updatedAt: string;
}

// Тип для відповіді зі списком нотаток
export interface PaginatedNotesResponse {
    page: number;
    perPage: number;
    totalNotes: number;
    totalPages: number;
    notes: Note[];
}

// Тип для AuthContext (це виправить ваші помилки)
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
