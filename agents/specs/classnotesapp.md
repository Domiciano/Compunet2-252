# Spec: classnotesapp

This document outlines the specifications for the `classnotesapp` project. It is a web application designed for presenting educational content, structured as a series of lessons.

## 1. Core Functionality

The primary function of `classnotesapp` is to render and display educational lessons from Markdown files. It provides a structured and navigable interface for users to consume the content.

## 2. Key Features

### 2.1. Content Management

-   **Markdown-Based Content:** All lesson content is written in Markdown (`.md`) files located in the `src/content/` directory. This allows for easy content creation and maintenance.
-   **Table of Contents (TOC):** The application's structure, including the order and hierarchy of lessons and sections, is defined in a dedicated `toc.md` file within the `src/content/` directory. The application dynamically parses this file to build its navigation.

### 2.2. User Interface & Experience

-   **Layout:** The application uses a responsive layout featuring a main content area and a navigation drawer.
    -   The navigation drawer is populated based on the `toc.md` file.
    -   The main content area displays the selected lesson.
-   **Global App Bar:** A persistent app bar (`AppBarGlobal`) is present at the top of the application, providing access to navigation controls.
-   **Styling:** The application uses Material-UI for its component library, ensuring a modern and consistent look and feel.

### 2.3. Navigation and Routing

-   **Client-Side Routing:** The app uses `react-router-dom` for all navigation.
-   **URL Structure:** Lessons are accessed via URLs in the format `/lesson/:lessonId`.
-   **Deep Linking:** The application supports deep linking. It uses a URL query parameter (`?p=...`) to capture the intended path, allowing a server to serve the main `index.html` file, which then uses client-side JavaScript to navigate to the correct lesson.
-   **Default Route:** When accessing the root of the application, it automatically redirects to the first lesson defined in the `toc.md`.

### 2.4. Content Rendering

-   **Markdown to HTML:** The application renders Markdown content as HTML within the `LessonPage` component.
-   **Syntax Highlighting:** Code blocks within the Markdown files are automatically syntax-highlighted using PrismJS, with the "tomorrow" theme.

### 2.5. State Management

-   **Theme:** The application has a `ThemeProvider`, suggesting that the theme (e.g., light/dark mode) can be customized.
-   **Studied Lessons:** A `StudiedLessonsProvider` is implemented, indicating functionality to track which lessons the user has completed or viewed.

## 3. Technical Stack

-   **Frontend Framework:** React
-   **Build Tool:** Vite
-   **UI Library:** Material-UI
-   **Routing:** React Router DOM v6
-   **Syntax Highlighting:** PrismJS
-   **Deployment:** The project includes a `Dockerfile` and an `nginx.conf`, indicating it is designed to be deployed as a Docker container.

## 4. Project Structure

-   `src/`: Contains all the application's source code.
-   `src/components/`: Reusable React components.
-   `src/pages/`: Top-level page components managed by React Router.
-   `src/content/`: Markdown files for lessons and the table of contents.
-   `src/theme/`: Files related to theming and context providers.
-   `public/`: Static assets.
-   `agents/specs/`: Directory for application specifications.





