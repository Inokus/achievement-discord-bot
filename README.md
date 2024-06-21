# achievement-discord-bot

This project implements a REST API with Discord bot integration for sending celebratory messages upon completing a sprint.

## Features

- REST API wrapping a database and a Discord bot
- Sends a celebratory message with a GIF whenever a user completes a sprint
- Supports CRUD operations for managing congratulatory message templates and sprints
- Uses Express.js, SQLite, Kysely, zod, Vitest, ESLint + Prettier, and TypeScript
- Uses migrations for database schema changes

## API Endpoints

### Messages

- `POST /messages`: Send a congratulatory message to a user on Discord. POST request must include username and sprint code. Both username and sprintCode are case sensitive

  ```
  {
      // Discord username
      "username": "john",

      // 6 character sprint code
      "sprintCode": "wd-1.1"
  }
  ```

- `GET /messages`: Get a list of all congratulatory messages
- `GET /messages?username=john`: Get messages for a specific user
- `GET /messages?sprint=wd-1.1`: Get messages for a specific sprint

### Templates

- `POST /templates`: Create a congratulatory message template
  ```
  {
      "content": "Cheers to your hard work paying off!"
  }
  ```
- `GET /templates`: Get all congratulatory message templates
- `GET /templates/:id`: Get a specific congratulatory message template
- `PATCH /templates/:id`: Update a specific congratulatory message template
- `DELETE /templates/:id`: Delete a specific congratulatory message template

### Sprints

- `POST /sprints`: Create a sprint

  ```
  {
      // 6 character sprint code
      "code": "wd-1.1",

      "title": "First Steps Into Programming with Python"
  }
  ```

- `GET /sprints`: Get all sprints
- `GET /sprints/:id`: Get a specific sprint
- `PATCH /sprints/:id`: Update a specific sprint
- `DELETE /sprints/:id`: Delete a specific sprint

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `example.env` to `.env` and fill in GIPHY API key and Discord token.

## Usage

Discord bot needs to have `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT` options enabled in discord developers portal.

Start the development server with `npm run dev` or production server with `npm start`.
