# Doodle Noodle
Doodle Noodle is an art prompt generator designed to help artists create unique and inspiring prompts for character design, scene illustration, and comic strips! It combines user-specified parameters with text corpora to generate creative prompts and provides a mood board of inspiration images :]

## Features
* **Art Prompt Generation:** Generates creative prompts tailored to character design, scene illustration, and comic strips.
* **Genre and Tone Selection:** Allows users to specify the desired genre (e.g., fantasy, cyberpunk, horror) and tone (e.g., whimsical, creepy, dramatic) of the prompt.
* **Keyword Input:** Enables users to add custom keywords to further refine the prompt.
* **Color Palette Input:** Allows users to specify a color palette for more precise prompt generation.
* **Inspiration Images:** Retrieves a mood board of relevant images from Unsplash, Pexels, and Pixabay based on the generated prompt.  Also incorporates user-uploaded images.

## Usage
1. Navigate to the desired creation type (Character, Scene, or Comic) from the home page.
2. Select a genre and tone from the dropdown menus.
3. Optionally, add keywords and a color palette in the provided input fields to further customize the prompt.
4. Click the "Generate" button to generate a prompt and display related inspiration images.

## Technologies Used
* **Next.js:** React framework for building the front-end.
* **React:** JavaScript library for building user interfaces.
* **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
* **Unsplash API:** Provides high-quality images for the inspiration board.
* **Pexels API:** Another source for high-quality and royalty-free images.
* **Pixabay API:** An additional API for accessing free stock images.
* **TypeScript:** Provides static typing for improved code maintainability and readability.
* **Node.js:** JavaScript runtime environment for the backend API.
* **Prisma:** ORM for interacting with the PostgreSQL database.
* **PostgreSQL:** Database for storing image metadata.
* **Cloudinary:** Cloud storage for user-uploaded images.

## API Documentation
### `/api/inspo-images`

This endpoint fetches inspiration images from Unsplash, Pexels, Pixabay, and user uploads.

**Request:**

GET `/api/inspo-images?genre={genre}&tone={tone}&keywords={keywords}`

* `genre`: The desired genre (e.g., "fantasy").
* `tone`: The desired tone (e.g., "whimsical").
* `keywords`: Additional keywords to refine the search (e.g., "magic, forest").

**Response:**

```json
{
  "images": [
    {
      "src": "image_url",
      "thumb": "thumbnail_url",
      "alt": "image_description",
      "link": "image_link",
      "source": "unsplash" // or "pexels" or "pixabay" or "user-upload"
    },
    // ... more images
  ]
}
```

### `/api/metadata`

This endpoint handles POST requests to store image metadata and GET requests to retrieve metadata.

**POST Request:**

* Stores image metadata (publicId, artistName, imageLink, genres, tones) in the database and Cloudinary context/custom_metadata.

**GET Request:**

* Retrieves metadata either for a specific `publicId` or all metadata if no `publicId` is provided.

### `/api/test`

This endpoint is for testing and retrieves images from Cloudinary.


### `/api/upload-inspo`

This endpoint handles user image uploads via Cloudinary.  Stores metadata both locally and within Cloudinary context/custom_metadata.

## Dependencies
See `package.json` for a complete list of project dependencies. Key dependencies include: React, Next.js, Tailwind CSS, Prisma, and Cloudinary.

## User Uploading
Users are encouraged to add their own artwork to inspire other users!  This is made possible through the use of Cloudinary for image storage and a PostgreSQL database managed via Railway.  Upload your artwork through the provided interface, specifying artist name, image link (optional), genres, and tones.  Your contributions will be displayed alongside images from Unsplash, Pexels, and Pixabay to fuel others' creativity!

## Contributing
Contributions to the sentences' library (corpora) are appreciated! Add text and create a pull request.  New corpora should be added to the `/public/corpora` directory.

## Configuration
Environment variables are used for API keys and database connection strings.  These should be set in a `.env.local` file (not included in the repository for security reasons).  Required environment variables include: `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

*README.md was made with [Etchr](https://etchr.dev)*