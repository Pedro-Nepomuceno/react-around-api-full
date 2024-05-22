Overview
This project is a web application deployed on AWS using Ubuntu as the operating system, Nginx as the web server, and PM2 as the process manager. It provides a comprehensive solution for building and deploying a full-stack web application with authentication and authorization features.

Features
Authentication and Authorization
User Registration: Users can register for an account with their email and password.
User Login: Registered users can log in to their account securely.
JWT Authentication: JSON Web Tokens (JWT) are used for authentication, providing a secure and stateless authentication mechanism.
Protected Routes: Certain routes are protected and require authentication. Users must be logged in to access these routes.
Database Integration
Database Storage: User data is stored in a database, ensuring persistence and scalability.
MongoDB: MongoDB is used as the database system, providing flexibility and scalability for storing user information.
Deployment
AWS Deployment: The application is deployed on Amazon Web Services (AWS), utilizing cloud infrastructure for scalability and reliability.
Ubuntu: The Ubuntu operating system is used for hosting the application on AWS, providing a stable and secure environment.
Nginx: Nginx serves as the web server, handling incoming HTTP requests and proxying them to the application server.
PM2: PM2 is used as the process manager, ensuring that the application runs continuously and can be easily managed and monitored.
