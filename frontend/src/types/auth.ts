export interface User {
  id: number;
  username: string;
  class_level?: string;
  board?: string;
}

/** Shape of the global auth slice held in `useAuthStore`. */
export interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}
