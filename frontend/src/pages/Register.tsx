import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api';
import { AuthActions, AuthCard, FormField, SelectField } from '@/components/feature/auth';
import {
  BOARDS,
  CLASS_LEVELS,
  DEFAULT_BOARD,
  DEFAULT_CLASS_LEVEL,
  REGISTER_ERROR_MESSAGE,
  ROUTES,
} from '@/constants';
import { useAsyncAction } from '@/hooks';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classLevel, setClassLevel] = useState(DEFAULT_CLASS_LEVEL);
  const [board, setBoard] = useState(DEFAULT_BOARD);

  const navigate = useNavigate();
  const { loading, error, run } = useAsyncAction(REGISTER_ERROR_MESSAGE);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    run(async () => {
      await authApi.register(username, password, classLevel, board);
      // On success, redirect to login
      navigate(ROUTES.LOGIN);
    });
  };

  return (
    <AuthCard
      title="Create an Account"
      description="Join AI Math Tutor to start your learning journey."
      error={error}
      onSubmit={handleRegister}
      footer={
        <AuthActions
          loading={loading}
          submitLabel="Sign Up"
          loadingLabel="Creating Account..."
          promptText="Already have an account?"
          linkLabel="Sign in"
          onLink={() => navigate(ROUTES.LOGIN)}
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
      <SelectField label="Class" value={classLevel} onChange={setClassLevel} options={CLASS_LEVELS} />
      <SelectField label="Board" value={board} onChange={setBoard} options={BOARDS} />
    </AuthCard>
  );
}
