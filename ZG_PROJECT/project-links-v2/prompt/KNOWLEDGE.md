# Project Knowledge Base (v2.0)

## Tech Stack Notes
- **Next.js 16 (App Router)**: Hybrid rendering and modern routing.
- **Tailwind CSS v4**: Utility-first CSS with CSS-variable-based configuration. Use `@import "tailwindcss"` in `globals.css`.
- **Zustand**: Minimalist state management for auth and UI state.
- **Firebase SDK v12.9.0**: Keep versions consistent across all imports to prevent initialization loops.
- **@dnd-kit**: Robust drag and drop for sorting categories and projects.

## Development Tips
- **Turbopack**: Run with `--turbopack` for much faster HMR in dev.
- **Firestore Parallelization**: Use `Promise.all` for batch queries (e.g., fetching projects for all categories) to avoid N+1 bottlenecks.
- **Miyabi Design**: Prioritize Glassmorphism (`backdrop-blur-xl`) and Zen-inspired negative space.

## Lessons Learned
- **Auth Export Consistency**: Always use `signIn`/`signOut` exports from `lib/firebase/auth.ts` to match the `useAuth` hook. Avoid using names like `login`/`logout`.
- **Favicon Overhead**: Third-party favicon services can slow down list rendering. Removing them and using minimalist internal icons keeps the UI responsive.
- **CSS Variable Injection**: In Tailwind v4, define design tokens in `@theme` blocks within CSS for better integration with components.
- **Operation Not Permitted**: Sandbox environments may throw `EPERM` during `pnpm build`. Instruct the user to run builds/dev commands locally when this occurs.
