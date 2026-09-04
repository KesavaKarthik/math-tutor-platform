import { useEffect } from 'react';

import { authApi } from '@/api';
import { useAuthStore } from '@/store';

/** Rehydrates the signed-in user from a persisted token, dropping stale ones. */
export function useAuthSession() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((user) => setUser(user))
        .catch(() => {
          // If the token is invalid or expired
          logout();
        });
    }
  }, [token, setUser, logout]);
}
