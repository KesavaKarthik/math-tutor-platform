import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api';
import { AuthActions, AuthCard, FormField } from '@/components/feature/auth';
import { LOGIN_ERROR_MESSAGE, ROUTES } from '@/constants';
import { useAsyncAction } from '@/hooks';
import { useAuthStore } from '@/store';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { loading, error, run } = useAsyncAction(LOGIN_ERROR_MESSAGE);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    run(async () => {
      const data = await authApi.login(username, password);
      // setToken saves the token to local storage immediately
      setToken(data.access_token);

      // now fetch the user profile using the new token
      try {
        const user = await authApi.getMe();
        setUser(user);
      } catch (err) {
        console.error("Failed to fetch user details after login", err);
      }

      navigate(ROUTES.DASHBOARD);
    });
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Enter your credentials to access your AI Tutor."
      error={error}
      onSubmit={handleLogin}
      footer={
        <AuthActions
          loading={loading}
          submitLabel="Sign In"
          loadingLabel="Signing in..."
          promptText="Don't have an account?"
          linkLabel="Sign up"
          onLink={() => navigate(ROUTES.REGISTER)}
          onGuest={() => navigate(ROUTES.DASHBOARD)}
        />
      }
    >
      <FormField label="Username" value={username} onChange={setUsername} placeholder="johndoe" required />
      <FormField
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        required
      />
    </AuthCard>
  );
}
