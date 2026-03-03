# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/main.jsx

Type: Other

## Responsibility
This file is the entry point of a React application. It sets up the basic structure by rendering the `App` component within context providers and routing.

## Inputs
- None (it does not accept any props)

## Dependencies
- React
- ReactDOM
- App component (`./App`)
- ThemeProvider from `./theme/ThemeContext`
- StudiedLessonsProvider from `./theme/StudiedLessonsContext`
- react-router-dom for BrowserRouter
- prism-tomorrow.css for syntax highlighting

## Side Effects
- Renders the entire React application within a browser environment.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/App.jsx

Type: Component

## Responsibility
The `App` component is the main entry point of the application. It manages the state for sections, handles loading and error states, and routes users based on the table of contents and URL parameters.

## Inputs
- `sections`: State to store parsed sections from the table of contents.
- `loading`: State to manage the loading state of the application.
- `location`: Hook to access the current location object.
- `navigate`: Hook for programmatic navigation.

## Dependencies
- `react-router-dom`: For routing and navigation.
- `@/utils/tableOfContentsParser`: Utility function to parse table of contents content.
- `@/content/toc.md?raw`: Raw content of the table of contents file.
- `@/components/drawer/Layout`: Layout component for the application.
- `@/pages/LessonPage`: Lesson page component.
- `@/components/AppBarGlobal`: Global app bar component.

## Side Effects
- Fetches sections from the table of contents on mount.
- Redirects to the first lesson or a specified deep path based on URL parameters.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/prism/languages/prism-sql-enhanced.js

Type: Utility

## Responsibility
This file defines the SQL language syntax highlighting rules for the Prism code highlighter library. It specifies patterns and token types that Prism should use to identify and style different elements of SQL code.

## Inputs
- None (it is a configuration object)

## Dependencies
- `Prism` (the Prism code highlighter library)

## Side Effects
- Modifies the `Prism.languages.sql` object, adding syntax highlighting rules for SQL.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/prism/languages/prism-java-enhanced.js

Type: Utility

## Responsibility
This file defines the syntax highlighting rules for Java in the Prism code highlighter library. It specifies patterns and regular expressions to identify different elements of Java code such as comments, strings, keywords, class names, functions, numbers, operators, and punctuation.

## Inputs
- None (it is a configuration object)

## Dependencies
- None (it uses only built-in JavaScript functionality)

## Side Effects
- Modifies the `Prism.languages` object to include Java syntax highlighting rules.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/prism/languages/prism-http.js

Type: Utility

## Responsibility
This file defines a custom language grammar for HTTP using Prism.js, which is used to syntax-highlight HTTP requests and responses in code editors.

## Inputs
- None

## Dependencies
- Prism.js (external library)

## Side Effects
- Registers the HTTP language with Prism.js

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/utils/markdownUtils.js

Type: Utility

## Responsibility
This utility function extracts the first title (lines that start with '[t]') from a given Markdown content.

## Inputs
- `markdownContent` (string): The complete content of the Markdown file.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/utils/tableOfContentsParser.js

Type: Utility

## Responsibility
The `TableOfContentsParser` utility function is responsible for parsing a table of contents (TOC) content string and extracting sections, including titles, dividers, and lessons. It processes the TOC content to identify different types of sections and retrieves lesson labels from raw content files.

## Inputs
- `tocContent`: A string representing the table of contents content to be parsed.

## Dependencies
- `getFirstTitleFromMarkdown` (from `./markdownUtils`)
- `allLessonRawContents` (from `./lessonImporter`)

## Side Effects
- Logs a warning message if a lesson file is not found.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/utils/lessonImporter.js

Type: Utility

## Responsibility
This utility file imports all Markdown files from the `@/content` directory and stores their raw contents in an object. It is used to dynamically load lesson content.

## Inputs
- None

## Dependencies
- `import.meta.glob`: A Vite feature for importing modules dynamically based on a glob pattern.
- `@/content/*.md`: The path to the Markdown files that need to be imported.

## Side Effects
- Reads and stores raw contents of Markdown files in memory.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/AppBarGlobal.jsx

Type: Component

## Responsibility
The `AppBarGlobal` component is a reusable navigation bar for the application. It includes a logo, title, and theme toggle button.

## Inputs
- `onOpenMobileToc`: A function to open the mobile table of contents.
- `onOpenMobileNav`: A function to open the mobile navigation menu.

## Dependencies
- `@mui/material/AppBar`
- `@mui/material/Toolbar`
- `@mui/material/IconButton`
- `@mui/material/Box`
- `@mui/material/Typography`
- `@mui/icons-material/LightMode`
- `@mui/icons-material/DarkMode`
- `@mui/icons-material/MenuBook`
- `@mui/icons-material/Menu`
- `@theme/ThemeContext` (relative import)
- `techlogo.png` (relative import)
- `@mui/material/useMediaQuery`
- `@mui/material/styles`

## Side Effects
None

This code appears to be a React component that renders a graphical user interface (GUI) for editing and visualizing Spring-based Java applications. The GUI includes:

1. A tab selector for switching between Java and XML configurations.
2. A code editor where users can write or edit their Spring configuration code.
3. An alert panel displaying various warnings and errors related to the code, such as missing classes, autowiring issues, and XML structure problems.
4. A canvas area where the visual representation of the application's bean relationships is displayed.

Key features:

- The canvas allows users to drag and drop beans (Spring components) around.
- It displays wiring between beans using arrows.
- Zoom functionality is provided via mouse wheel scrolling.
- Tooltips appear when hovering over beans, showing their names.
- The component uses a combination of React state management and event handling for interactivity.

This GUI seems designed to help developers visualize and debug Spring-based applications more easily by providing both textual and graphical representations of the application's structure.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/xmlValidation.js

Type: Utility

## Responsibility
This utility function validates the structure of an XML document according to specific rules for Spring configuration. It checks for proper opening and closing tags, correct usage of `<beans>` and `<bean>`, and ensures that all beans are properly closed.

## Inputs
- `text` (string): The XML text to be validated.

## Dependencies
- None

## Side Effects
- Returns an object containing warnings if any validation issues are found.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/configWiringDetection.js

Type: Utility

## Responsibility
This utility function `parseConfigWirings` is responsible for detecting wiring between methods annotated with `@Bean` in classes annotated with `@Configuration`. It parses the provided text to identify these wirings and returns an object containing the detected wirings and any missing configuration types.

## Inputs
- `text`: A string representing the source code of a Java class.
- `beans`: An array of objects, each representing a bean with properties like `className` and `beanName`.

## Dependencies
- None (uses only built-in JavaScript functions)

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/methodWiringDetection.js

Type: Utility

## Responsibility
This utility function `parseMethodWirings` analyzes Java code to detect method wirings based on `@Autowired` and `@Qualifier` annotations. It identifies the beans involved, checks for type compatibility, and validates that required types exist.

## Inputs
- `text`: The source code text of a Java class.
- `beans`: An array of bean objects containing information about each bean.

## Dependencies
- `extractClassBody`: A helper function imported from './beanDetection.js' to extract the body of a class from its full source code.

## Side Effects
- Logs debug information to the console for class bodies and method parameters.
- Returns an object containing two arrays: `methodWirings` (details of successful wirings) and `missingAutowiredMethodTypes` (errors related to missing or incompatible types).

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/constructorWiringDetection.js

Type: Utility

## Responsibility
This utility function `parseConstructorWirings` is responsible for detecting constructor wiring in Java code, specifically identifying which beans are being injected into other beans via their constructors. It parses the provided text to extract class and bean information, then analyzes the constructor parameters to determine if they match any declared beans.

## Inputs
- `text`: A string containing Java source code.
- `beans`: An array of objects representing beans with properties like `className` and `beanName`.

## Dependencies
- `extractClassBody`: A function imported from './beanDetection.js' used to extract the body of a class from the provided text.

## Side Effects
- None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/xmlWiringDetection.js

Type: Utility

## Responsibility
This utility function `parseXmlWirings` is responsible for parsing XML Spring configuration text to detect wirings (dependencies) between beans. It identifies wiring relationships through constructor arguments and properties, mapping bean names to their respective bean objects for quick lookup.

## Inputs
- `text`: A string containing the XML Spring configuration text.
- `beans`: An array of bean objects, each with a `beanName` property.

## Dependencies
- None (no internal project dependencies or relative imports)

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/layoutCalculation.js

Type: Utility

## Responsibility
This utility function calculates the hierarchical levels of beans based on their dependencies. It helps in determining how beans should be laid out in a visual hierarchy.

## Inputs
- `beans`: An array of bean objects.
- `wirings`: An array of wiring objects representing dependencies between beans.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/wiringDetection.js

Type: Utility

## Responsibility
This utility function `parseWirings` is responsible for parsing a given text (likely Java code) to detect wiring relationships between beans. It identifies classes, their properties annotated with `@Autowired`, and attempts to determine the target bean(s) based on the property type or qualifier.

## Inputs
- `text`: A string containing Java code.
- `beans`: An array of objects representing beans, each with a `beanName` and `className`.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/cycleDetection.js

Type: Utility

## Responsibility
This utility function `detectCycles` is responsible for detecting cycles in the wiring of beans. It takes an array of beans and an array of wirings, constructs a directed graph, and uses Depth-First Search (DFS) to identify any cycles within the graph.

## Inputs
- `beans`: An array of bean objects.
- `wirings`: An array of wiring objects, each with properties `from` and `to`.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/validations.js

Type: Utility

## Responsibility
This utility function `validateCode` is responsible for validating Java code related to beans. It checks for issues such as unbalanced brackets, duplicate class names, and missing declared classes.

## Inputs
- `code`: A string containing the Java code to be validated.
- `beans`: An array of objects representing beans in the code.

## Dependencies
- None

## Side Effects
- Returns an object containing warnings and errors based on the validation results.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/xmlBeanDetection.js

Type: Utility

## Responsibility
This utility function `parseXmlBeans` is responsible for parsing XML text to extract bean definitions. It uses regular expressions to identify and parse `<bean>` tags, extracting their attributes such as `id`, `class`, and `name`. The function then constructs an array of objects representing the beans found in the XML.

## Inputs
- `text`: A string containing XML content from which bean definitions need to be extracted.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/regex/beanDetection.js

Type: Utility

## Responsibility
This file contains utility functions for extracting and parsing Java classes to identify beans annotated with specific annotations such as `@Component`, `@Service`, `@Repository`, `@Controller`, and `@RestController`. It also handles the extraction of class bodies and parsing of methods annotated with `@Bean`.

## Inputs
- `text`: A string containing Java code.
- `startIdx`: An optional index indicating where to start searching for the class body.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/components/TabSelector.jsx

Type: Component

## Responsibility
The `TabSelector` component is a functional component that renders two buttons for selecting between Java and XML tabs. It accepts two props, `onJavaClick` and `onXmlClick`, which are functions to be called when the respective buttons are clicked.

## Inputs
- `onJavaClick`: A function to be called when the "Java" button is clicked.
- `onXmlClick`: A function to be called when the "XML" button is clicked.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/components/CodeEditor.jsx

Type: Component

## Responsibility
The `CodeEditor` component is a reusable UI element that allows users to edit Java code. It uses the `react-simple-code-editor` library for the editor functionality and `prismjs` for syntax highlighting.

## Inputs
- `code`: The initial value of the code editor.
- `onChange`: A callback function that gets called when the code changes.

## Dependencies
- `react`
- `react-simple-code-editor`
- `prismjs`
- `prismjs/components/prism-java`
- `prismjs/themes/prism-tomorrow.css`

## Side Effects
None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/components/Canvas.jsx

Type: Component

## Responsibility
The `Canvas` component is responsible for rendering a canvas element with zoom functionality. It handles mouse events to allow dragging and zooming, and displays a vertical slider for adjusting the zoom level.

## Inputs
- `zoom`: The current zoom level of the canvas.
- `canvasWidth`: The width of the canvas.
- `handleMouseDown`: Function to handle mouse down events.
- `handleMouseUp`: Function to handle mouse up events.
- `handleMouseMove`: Function to handle mouse move events.
- `canvasRef`: Reference to the canvas element.
- `MIN_ZOOM` and `MAX_ZOOM`: Minimum and maximum zoom levels.
- `setZoom`: Function to update the zoom level.
- `CANVAS_HEIGHT`: Height of the canvas.
- `dragging`: Boolean indicating whether the canvas is being dragged.

## Dependencies
- None

## Side Effects
- Handles mouse events for dragging and zooming.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/components/Alert.jsx

Type: Component

## Responsibility
The `Alert` component is responsible for displaying various types of warnings and errors in a styled alert box. It conditionally renders different warning messages based on the props it receives.

## Inputs
- `errors`: An array of error messages.
- `bracketWarning`, `returnWarning`, `multiNameWarning`: Individual warning messages.
- `missingClassWarnings`, `autowiredInvalids`, `missingAutowiredTypes`, `missingAutowiredMethodTypes`, `missingConstructorTypes`, `unassignedConstructorParams`, `cycleWarnings`: Arrays of warnings related to specific issues.
- `xmlStructureWarning`, `xmlTagWarning`, `xmlClosingWarning`, `beanUnclosedWarning`, `missingXmlClassWarnings`, `brokenXmlWirings`: Individual warning messages related to XML structure and wirings.

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/BeanVisualizer/model/buildBeanGraph.js

Type: Utility

## Responsibility
The `buildBeanGraph` function processes Java or XML code to extract bean definitions and wirings, validates the structure, and returns a graph representation of the beans and their relationships.

## Inputs
- `code`: The source code string containing bean definitions and wirings.

## Dependencies
- Relative imports from `../regex/beanDetection.js`, `../regex/wiringDetection.js`, etc., for parsing different types of bean and wiring information.
- `validateCode` and `validateXmlStructure` functions for validating the code and XML structure, respectively.

## Side Effects
- None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/drawer/Layout.jsx

Type: Component

## Responsibility
The `Layout` component is a reusable layout structure for the application, providing a navigation drawer that can be toggled on mobile devices and fixed on larger screens. It includes sections for lessons with options to mark them as studied.

## Inputs
- `children`: The main content of the page.
- `sections`: An array of section objects defining the contents of the navigation drawer.
- `onOpenMobileNav`: A callback function to handle opening the mobile navigation drawer.

## Dependencies
- React, useState, useEffect from "react"
- Box, Drawer, List, ListItemButton, ListItemText, IconButton from "@mui/material"
- useMediaQuery, useTheme from "@mui/material/styles"
- Link, useLocation from "react-router-dom"
- useThemeMode and useStudiedLessons from '@/theme/Contexts'

## Side Effects
- Toggles the mobile navigation drawer state based on user interaction.
- Updates the `onOpenMobileNav` callback when it changes.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/drawer/DrawerDivider.jsx

Type: Component

## Responsibility
The `DrawerDivider` component is a reusable UI element that renders a horizontal divider within a drawer, styled according to the current theme.

## Inputs
None

## Dependencies
- `@mui/material/Divider`: Material-UI Divider component.
- `@mui/material/Box`: Material-UI Box component for layout purposes.
- `useThemeMode` from '@/theme/ThemeContext': Hook to access the current theme mode.

## Side Effects
None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/drawer/sections.jsx

Type: Component

## Responsibility
This component defines a list of sections for a drawer, each containing lessons. It uses the `LessonParser` component to render Markdown content.

## Inputs
- None

## Dependencies
- `LessonParser`: A custom component used to parse and display Markdown content.
- `lesson1`: A raw Markdown file imported as a string.

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/drawer/DrawerTitle.jsx

Type: Component

## Responsibility
The `DrawerTitle` component is a reusable UI element that displays a title within a drawer. It uses the theme context to dynamically set the color of the title based on the current theme.

## Inputs
- `children`: The text or content to be displayed as the title.

## Dependencies
- `@mui/material/Typography`: A Material-UI component for displaying typography.
- `useThemeMode` from '@/theme/ThemeContext': A custom hook that provides access to the current theme mode and its properties.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/embed/YouTubeEmbed.jsx

Type: Component

## Responsibility
The `YouTubeEmbed` component is responsible for rendering an embedded YouTube video player. It takes a `videoId` prop and optionally a `title`, and displays the video within a styled container.

## Inputs
- `videoId`: The ID of the YouTube video to embed.
- `title`: (Optional) The title of the video, used as the iframe's title attribute.

## Dependencies
- `@mui/material/Box`: A Material-UI component for styling the container.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/embed/DartPadEmbed.jsx

Type: Component

## Responsibility
The `DartPadEmbed` component is responsible for embedding a DartPad instance within the application. It takes a `gistId` as a prop and renders an iframe that displays the DartPad with the specified gist.

## Inputs
- `gistId`: A string representing the ID of the Gist to be embedded.
- `height`: An optional string representing the height of the iframe, defaulting to '800px'.

## Dependencies
- `@mui/material/Box`: Used for styling and layout purposes.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/code/CodeBlock.jsx

Type: Component

## Responsibility
The `CodeBlock` component is a reusable UI element that displays code snippets with syntax highlighting and a copy-to-clipboard button. It supports various programming languages and custom styles.

## Inputs
- `children`: The code content to be displayed.
- `language`: The programming language of the code snippet, used for syntax highlighting.
- `className` (optional): Additional CSS classes to apply to the component.

## Dependencies
- React: For building the component.
- Prism.js: For syntax highlighting.
- MUI Material: For UI components like `Box` and `IconButton`.
- Custom Prism languages: Imported from "@/prism/languages/" for enhanced syntax highlighting of specific languages.
- Custom CSS: Imported from "@/styles/flutter-like.css" for styling.

## Side Effects
- The component uses the `useEffect` hook to apply syntax highlighting using Prism.js whenever the `children` or `language` props change.
- The `copyToClipboard` function is called when the copy button is clicked, copying the code content to the clipboard.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/LessonTittle.jsx

Type: Component

## Responsibility
The `LessonTitle` component is responsible for rendering a styled title for lessons. It uses the theme context to dynamically set the color of the title based on the current theme.

## Inputs
- `children`: The text content to be displayed as the lesson title.

## Dependencies
- `@mui/material/Typography`: A Material-UI component used for typography.
- `useThemeMode` from '@/theme/ThemeContext': A custom hook that provides access to the current theme context.

## Side Effects
None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/TableOfContents.jsx

Type: Component

## Responsibility
The `TableOfContents` component is responsible for rendering a table of contents for a lesson. It displays the subtitles as clickable items that scroll to their respective sections on the page and can mark the lesson as completed.

## Inputs
- `subtitles`: An array of subtitle objects, each with an `id` and `text`.
- `lessonTitle`: The title of the lesson.
- `activeSection`: The ID of the currently active section.
- `lessonId`: The ID of the lesson.

## Dependencies
- `@mui/material/Box`, `@mui/material/Typography`, `@mui/material/List`, `@mui/material/ListItem`, `@mui/material/ListItemButton`, and `@mui/material/ListItemText` from Material-UI for UI components.
- `useThemeMode` hook from the `@/theme/ThemeContext` context to access theme-related data.

## Side Effects
- Scrolls to a subtitle section when clicked.
- Updates the URL hash with a slug based on the selected subtitle text.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/TryCodeButton.jsx

Type: Component

## Responsibility
The `TryCodeButton` component is a React component that renders two buttons for switching between viewing code and running it in an embedded DartPad environment. It manages the state of which view to display using the `useState` hook.

## Inputs
- `gistId`: A string representing the ID of the Gist to be displayed in DartPad.
- `codeBlock`: React nodes representing the code block to be displayed when not in DartPad mode.

## Dependencies
- `@mui/material/Button`: Material-UI Button component for rendering buttons.
- `@mui/material/Box`: Material-UI Box component for layout purposes.
- `../embed/DartPadEmbed`: A custom component for embedding a DartPad environment.
- '@/theme/ThemeContext`: A context for managing theme-related state.

## Side Effects
- Uses the `useState` hook to manage the state of whether to show the DartPad or not.
- Uses the `useThemeMode` hook from the theme context to get the current theme.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/LessonParser.jsx

Type: Component

## Responsibility
The `LessonParser` component is responsible for parsing and rendering structured lesson content. It processes a raw text input containing various markdown-like tags to generate React components representing different elements of the lesson, such as titles, paragraphs, code blocks, images, videos, etc.

## Inputs
- `content`: A string containing the raw lesson content to be parsed.

## Dependencies
- Relative imports from various components like `LessonTitle`, `LessonSub`, `CodeBlock`, `YouTubeEmbed`, etc.
- Absolute import for `@mui/material/Typography`.
- Local import for `images` and `TryCodeButton`.

## Side Effects
- No significant side effects are performed within this component.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/Link.jsx

Type: Component

## Responsibility
The `Link` component is a reusable UI element that renders a styled link to an external URL. It uses the `useThemeMode` hook to dynamically adjust its color based on the current theme.

## Inputs
- `displayname`: The text displayed for the link.
- `url`: The URL the link points to.

## Dependencies
- `@mui/icons-material/Launch`: A Material UI icon used to indicate an external link.
- `useThemeMode` from '@/theme/ThemeContext': A hook that provides theme-related data and functions.

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/IconBlock.jsx

Type: Component

## Responsibility
The `IconBlock` component is responsible for displaying an image within a styled box. It accepts the source URL of the image and an optional alt text as props.

## Inputs
- `src`: The source URL of the image.
- `alt`: (Optional) Alternative text for the image, defaulting to "Imagen".

## Dependencies
- `@mui/material/Box`: A Material-UI component used for styling the container.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/LessonSub.jsx

Type: Component

## Responsibility
The `LessonSub` component is a styled typography component that displays the children text with specific styling based on the current theme.

## Inputs
- `children`: The text to be displayed.
- `id`: An optional ID for the Typography element.

## Dependencies
- `@mui/material/Typography`: A Material-UI component for displaying text.
- `useThemeMode` from '@/theme/ThemeContext': A custom hook that provides access to the current theme context.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/LessonParagraph.jsx

Type: Component

## Responsibility
The `LessonParagraph` component is a reusable UI element that displays text with styled typography. It adjusts the font size and color based on the current theme.

## Inputs
- `children`: The text content to be displayed within the paragraph.

## Dependencies
- `@mui/material/Typography`: A Material-UI component for rendering text.
- `useThemeMode` from '@/theme/ThemeContext': A custom hook that provides access to the current theme mode (e.g., light or dark).

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/LessonContainer.jsx

Type: Component

## Responsibility
The `LessonContainer` component is a styled container that wraps its children with specific padding and box sizing properties. It provides a consistent layout for lessons within the application.

## Inputs
- `children`: React nodes to be rendered inside the container.

## Dependencies
- `@mui/material/Box`: A Material-UI component used for styling the container.

## Side Effects
None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/components/lesson/ImageBlock.jsx

Type: Component

## Responsibility
The `ImageBlock` component is responsible for displaying an image with a styled container. It accepts the source URL and an optional alt text as props.

## Inputs
- `src`: The URL of the image to be displayed.
- `alt`: (Optional) Alternative text for the image, defaulting to 'Imagen'.

## Dependencies
- `@mui/material/Box`: A Material-UI component used for styling the container.

## Side Effects
None.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/theme/ThemeContext.jsx

Type: Context

## Responsibility
The `ThemeContext` provides a way to manage and share the theme mode (light or dark) across different components in the application. It includes functions to toggle between themes and ensures that the body class of the document reflects the current theme.

## Inputs
- `children`: The React children that will have access to the theme context.

## Dependencies
- `./colors.js`: Contains color definitions for light and dark themes.
- `React`, `createContext`, `useContext`, `useState`, `useMemo`, `useEffect`: Standard React hooks.

## Side Effects
- Modifies the class of the document's body element to reflect the current theme mode.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/theme/StudiedLessonsContext.jsx

Type: Context

## Responsibility
The `StudiedLessonsContext` provides a way to manage and share the state of studied lessons across different components in the application. It allows components to toggle whether a lesson has been studied or not, and it persists this state using local storage.

## Inputs
- `children`: The children components that will consume the context.

## Dependencies
- React: For creating the context, managing state, and handling effects.
- useState: To manage the list of studied lessons in the component's state.
- useEffect: To persist the state to local storage and handle changes from other tabs/windows.
- useCallback: To memoize the `toggleStudied` function.

## Side Effects
- The context provider listens for storage events to update its state when another tab or window updates the local storage.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/theme/colors.js

Type: Utility

## Responsibility
This file defines color themes for the application, providing a consistent set of color values that can be used throughout the UI. It exports two theme objects (`light` and `dark`) and sets the default to `dark`.

## Inputs
- None

## Dependencies
- None

## Side Effects
- None

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/hooks/useContentSpy.js

Type: Hook

## Responsibility
The `useContentSpy` hook is responsible for tracking the currently active section in a document based on subtitle elements. It updates the state and URL hash when a new section becomes visible, ensuring that the user can navigate through the content smoothly.

## Inputs
- `subtitles`: An array of objects representing subtitles with an `id` and `text`.

## Dependencies
- `useEffect` from 'react'
- `useState` from 'react'
- `useLocation` from 'react-router-dom'

## Side Effects
- Sets up IntersectionObserver to track subtitle elements for visibility.
- Handles scroll events to detect when the user is near the end of the page.
- Updates the URL hash based on the currently active section.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/assets/index.js

Type: Utility

## Responsibility
This file is a utility that dynamically imports all image files (PNG, JPG, JPEG, SVG) from the `assets` directory and exports them as an object where the keys are the filenames without the path, and the values are the imported images.

## Inputs
- None

## Dependencies
- `import.meta.glob`: A Vite feature for dynamic import of modules based on glob patterns.

## Side Effects
- Dynamically imports image files from the specified directory.

# /Users/domicianorincon/Documents/GIT/Compunet2-252/classnotesapp/src/pages/LessonPage.jsx

Type: Component

## Responsibility
The `LessonPage` component is responsible for displaying a lesson page, including parsing the lesson content, managing state for loading and table of contents visibility, and handling theme mode.

## Inputs
- `sections`: An array of sections that includes lesson information.
- `ref`: A reference to control the mobile TOC visibility.

## Dependencies
- `useParams` from `react-router-dom` for accessing route parameters.
- `useState`, `useEffect`, `useMemo`, `forwardRef`, and `useImperativeHandle` from React for state management and imperative handle communication.
- `LessonParser` from `@/components/lesson/LessonParser` for parsing lesson content.
- `allLessonRawContents` from `@/utils/lessonImporter` for accessing raw lesson contents.
- `TableOfContents` from `@/components/lesson/TableOfContents` for rendering the table of contents.
- `useThemeMode` from '@/theme/ThemeContext' for accessing theme mode.
- `CloseIcon` from '@mui/icons-material/Close' for the close button in mobile TOC.
- `useContentSpy` from '@/hooks/useContentSpy' to track active section.

## Side Effects
- Fetches lesson content based on `lessonId`.
- Updates state when `lessonId` or `sections` change.
- Scrolls to the top of the page when the lesson changes.

