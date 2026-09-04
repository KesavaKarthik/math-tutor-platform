interface ApiErrorShape {
  response?: { data?: { detail?: string } };
}

/** Pulls FastAPI's `detail` out of an axios error, falling back to a friendly message. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return (error as ApiErrorShape)?.response?.data?.detail || fallback;
}
