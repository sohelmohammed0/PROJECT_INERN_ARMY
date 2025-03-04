# Use the official Nginx image
FROM nginx:alpine

# Set working directory to Nginx's HTML folder
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy only necessary static files (improves build efficiency)
COPY index.html .

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

