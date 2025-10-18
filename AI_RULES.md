# AI Development Rules

This document outlines the tech stack and development conventions for this project. Following these rules ensures consistency, maintainability, and high-quality code.

## Tech Stack

This is a full-stack application built with the following technologies:

*   **Frontend Framework**: React with Vite for a fast development experience.
*   **Language**: TypeScript is preferred for all new components and logic for type safety. Existing JavaScript files (`.jsx`) should be migrated when significantly modified.
*   **Styling**: Tailwind CSS is used exclusively for styling.
*   **UI Components**: A combination of custom components and `shadcn/ui` for the base component library.
*   **Routing**: `react-router-dom` for all client-side navigation.
*   **Animations**: `framer-motion` for creating fluid and engaging user interface animations.
*   **Icons**: `lucide-react` for a consistent and clean icon set.
*   **Backend**: A Node.js server using the Express framework.
*   **Database**: PostgreSQL for data persistence.
*   **Authentication**: Custom JWT-based authentication handled by the backend server.

## Library Usage Guidelines

To maintain consistency, please adhere to the following library and pattern usage rules:

*   **UI Components**:
    *   When a standard UI element is needed (e.g., Button, Input, Card), first check if a suitable component exists in `src/components/ui` (from `shadcn/ui`).
    *   For more complex, application-specific components, create new files under `src/components` or `src/sections`.
    *   Always create new components in their own files. Do not add multiple components to a single file.

*   **Styling**:
    *   Use Tailwind CSS utility classes for all styling.
    *   Do not write custom CSS files or use inline style objects unless absolutely necessary for a specific, dynamic property that Tailwind cannot handle.
    *   Use the `cn` utility function from `src/lib/utils.ts` to conditionally apply classes.

*   **Routing**:
    *   All client-side routes should be defined within the `<Routes>` component in `src/App.jsx`.
    *   Use `<Link>` or `<NavLink>` from `react-router-dom` for internal navigation.

*   **Icons**:
    *   Exclusively use icons from the `lucide-react` package. This ensures visual consistency.

*   **Animations**:
    *   Implement all animations and transitions using the `framer-motion` library.

*   **State Management**:
    *   For simple global state (e.g., authentication, theme), use React Context. See `src/auth/AuthContext.jsx` for an example.
    *   For local component state, use the `useState` and `useReducer` hooks.

*   **Code Structure**:
    *   Reusable components go in `src/components/`.
    *   Large, single-use page sections can go into `src/sections/`.
    *   Utility functions should be placed in `src/lib/`.
    *   The backend server code resides in the `server/` directory.