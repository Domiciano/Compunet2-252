# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Special Tags for Lessons

The lesson content files in `src/content/` use a set of special tags to format the content. Any text that is not part of a special tag is treated as a paragraph.

Here is a list of the available tags:

*   `[t]Title`: Main title of the lesson.
*   `[st]Subtitle`: A subtitle within the lesson.
*   `[code:lang]...[endcode]`: A block of code in the specified language `lang`.
*   `[v]youtube_id|video_title`: Embeds a YouTube video with the given ID and title.
*   `[i]image_name|alt_text`: Displays an image from the `src/assets` folder.
*   `[icon]icon_name|alt_text`: Displays a small icon from the `src/assets` folder.
*   `[dartpad]gist_id`: Embeds a DartPad editor with the code from the given Gist ID.
*   `[trycode]gist_id`: Displays a button that opens a code editor with the code from the given Gist ID.
*   `[link]display_name url` or `[link](display name) url`: Creates a hyperlink.
*   `` `inline code` ``: Formats a piece of text as inline code.
*   `[beansim]...[endbeansim]`: A special block for a "Bean Simulator" component.
*   `[list]...[endlist]`: Creates a list. Each line between the tags is a list item.
