# LocalBiteApi

LocalBiteApi is the backend API for a broader ecosystem designed to help users discover nearby restaurants offering the best-rated dishes. Through community-driven reviews and ratings, users can easily search for dishes like "pizza" and find the top restaurants serving them, based on real customer feedback. Additionally, restaurant owners can onboard their businesses into the LocalBite ecosystem to enhance visibility and attract new customers.

## 🌟 Features

- 🔍 Search for dishes and see which restaurants serve them best
- ⭐ Leave reviews and ratings on dishes
- 📍 Location-based discovery of nearby restaurants
- 🏢 Restaurant onboarding to join the platform
- 🔐 Secure user authentication and session management

## 🧱 Tech Stack

- **Node.js + Express** – for building the RESTful API
- **PostgreSQL** – for storing structured data (restaurants, dishes, reviews)
- **MongoDB** – for quick access to server sessions used in authentication
- **Swagger (OpenAPI 3.0)** – for API documentation
- **Docker** – for containerizing the server and PostgreSQL

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (must be installed)

### Clone the repository

```bash
git clone https://github.com/Ozzodev/LocalBiteApi.git
cd LocalBiteApi
```

### Set up environment variables

Create a `.env` file in the root directory and copy variables form example.env

> Customize as needed for your local environment.

### Start the API

```bash
docker-compose up --build
```

### Access API Documentation

Once the server is running, you can access the interactive API docs via Swagger at:

```
http://localhost:3123
```

## 🧪 Testing

You can use tools like **Postman** or **Swagger UI** to test the available endpoints once the server is running.
