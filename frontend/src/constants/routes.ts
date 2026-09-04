/** Builders used with `navigate()` / `<Navigate to>`. */
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CHAT: "/chat",
  CHAPTER: (id: number | string) => `/chapter/${id}`,
  LEARNING_MODE: (id: number | string) => `/chapter/${id}/learning`,
  SOCRATIC_MODE: (id: number | string) => `/chapter/${id}/socratic`,
};

/** Path patterns (with `:id` placeholders) used to declare routes in `App`. */
export const ROUTE_PATTERNS = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CHAT: "/chat",
  CHAPTER: "/chapter/:id",
  LEARNING_MODE: "/chapter/:id/learning",
  SOCRATIC_MODE: "/chapter/:id/socratic",
};
