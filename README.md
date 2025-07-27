# Doodle Noodle
Doodle Noodle is an art prompt generator designed to help artists create unique and inspiring prompts for character design, scene illustration, and comic strips!  It combines user-specified parameters with text corpora to generate creative prompts and provides a mood board of inspiration images :3

## Features
*   **Art Prompt Generation:** Generates creative prompts tailored to character design, scene illustration, and comic strips.
*   **Genre and Tone Selection:** Allows users to specify the desired genre (e.g., fantasy, cyberpunk, horror) and tone (e.g., whimsical, creepy, dramatic) of the prompt.
*   **Keyword Input:** Enables users to add custom keywords to further refine the prompt.
*   **Color Palette:** Gives the option to materialize users's visions better.
*   **Inspiration Images:** Retrieves a mood board of relevant images from Unsplash, Pexels, and Pixabay based on the generated prompt.

## Usage
1.  Navigate to the desired creation type (Character, Scene, or Comic) from the home page.
2.  Select a genre and tone from the dropdown menus.
3.  Optionally, add keywords in the provided input fields to further customize the prompt.
4.  Click the "Generate" button to generate a prompt and display related inspiration images.

## Technologies Used
*   **Next.js:** A React framework for building web applications, used for the front-end development of this project.
*   **React:** A JavaScript library for building user interfaces.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Unsplash API:** Provides high-quality images for the inspiration board.
*   **Pexels API:** Another source for high-quality and royalty-free images.
*   **Pixabay API:** An additional API for accessing free stock images.
*   **TypeScript:** Provides static typing for improved code maintainability and readability.
*   **Node.js:**  The JavaScript runtime environment used to run the backend API.

## API Documentation
The `/api/inspo-images` API endpoint fetches inspiration images from Unsplash, Pexels, and Pixabay.

**Request:**

GET `/api/inspo-images?genre={genre}&tone={tone}&keywords={keywords}`

*   `genre`:  The desired genre (e.g., "fantasy").
*   `tone`: The desired tone (e.g., "whimsical").
*   `keywords`: Additional keywords to refine the search (e.g., "magic, forest").

**Response:**

```json
{
  "images": [
    {
      "src": "image_url",
      "thumb": "thumbnail_url",
      "alt": "image_description",
      "link": "image_link",
      "source": "unsplash" // or "pexels" or "pixabay"
    },
    // ... more images
  ]
}
```

## Dependencies
The project dependencies are listed in the `package.json` file.  Key dependencies include React, Next.js, and Tailwind CSS.

## Contribution
Contribution to the sentences' library (corpora) is appreciated! Add text and make your own branch for me to check :]

*README.md was made with [Etchr](https://etchr.dev)*