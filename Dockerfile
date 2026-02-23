# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Tailwind CSS (so it's ready before the app starts)
RUN npx tailwindcss -i ./src/public/styles.css -o ./src/public/output.css

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]