# Persona Management System (CRUD API)

A simple full-stack CRUD application built with Node.js, Express, and Vanilla JavaScript. It manages **Users (personas)** and **Powers** through a REST API and a custom web UI. Data is stored in memory, so no database is required.

## Features

- **Full CRUD** for users and powers using standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Bulk operations:** create, update, and delete multiple records in a single request.
- **Custom frontend:** a responsive UI built with vanilla HTML, CSS, and the Fetch API. No Postman needed.
- **Static serving:** Express serves both the API and the frontend from one port.

## Tech Stack

- Node.js (ES modules)
- Express 5
- Nodemon (development)
- Vanilla HTML / CSS / JavaScript

## Getting Started

```bash
git clone https://github.com/aysedakom/CRUDApi.git
cd CRUDApi
npm install
npm run serve
```

Then open:

- Frontend: http://localhost:3000/index.html
- API: http://localhost:3000

> Data resets whenever the server restarts.

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get a single user |
| POST | `/users` | Create a user, or an array of users |
| PUT | `/users/:id` | Update a single user |
| PUT | `/users` | Bulk update (array of objects with `id`) |
| DELETE | `/users/:id` | Delete a single user |
| DELETE | `/users` | Bulk delete (body: `{ "ids": [1, 2] }`) |

### Powers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/powers` | List all powers |
| GET | `/powers/:id` | Get a single power |
| POST | `/powers` | Create a power, or an array of powers |
| PUT | `/powers/:id` | Update a power |
| DELETE | `/powers/:id` | Delete a single power |
| DELETE | `/powers` | Bulk delete (body: `{ "ids": [1, 2] }`) |

### Data Shapes

```json
// User
{ "id": 1, "name": "Loki", "role": "Hero" }

// Power
{ "id": 1, "powerName": "Illusion Casting", "type": "Magic" }
```

## Project Structure

```
CRUDApi/
├── index.js        # Express server and API routes
├── package.json
└── public/
    ├── index.html  # Frontend UI
    └── skeleton-surprise.js
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run serve` | Start the server with nodemon |
| `npm run dev` | Same as `serve` |
