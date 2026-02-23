# Redis Authentication API

RESTful authentication API built with **Node.js**, **Express**, and **Redis**. Front end styled with **Tailwind CSS** for easy testing.

---

## Optional Packages I Used

1. express-validator for validation

2. bcryptjs for hashing passwords

3. helmet for security middleware

4. tailwind for front end styling

5. dotenv for loading environment variables (redis url and port)

6. jest and supertest for integration tests

7. concurrently for building tailwind and app

## Run with Docker

1.  Clone the repository

2.  Set up .env with PORT and REDIS_URL. ie.
    PORT=3000
    REDIS_URL=redis://localhost:6379

3.  Run the application with
    docker-compose up --build

4.  Access the app at localhost:3000

5.  Stop the application with
    docker-compose down

---

## 🧪 How to Run Tests

I have set up **Jest** and **Supertest** for integration tests.

Run the test suite with:
npm test
