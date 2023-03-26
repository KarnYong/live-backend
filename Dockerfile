# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies for the app
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 for the app to listen on
EXPOSE 5000

# Start the app when the container starts
CMD [ "npm", "start" ]