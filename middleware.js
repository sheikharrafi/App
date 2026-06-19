// Middleware disabled - auth handled client-side
// This prevents redirect loops between middleware and client auth state

export function middleware() {
  // No-op - allow all requests
}

export const config = {
  matcher: [],
};
