# Assignment 1 - REST API Project - Response to Criteria

## Overview

- **Name:** Marie Haug Laukeland
- **Student number:** n12541184
- **Application name:** Image Classification
- **Two line description:**
  This is an application where you upload a photo, where a machine learning model classifies what it is a picture of. You can log in to see all the images and their classification. Admins can also delete uploaded images in addition to uploading their own. The references.md is a refernce list to my project. 

## Core criteria

### Containerise the app

- **ECR Repository name:** 12541184-assign1
- **Video timestamp:** 0:30
- **Relevant files:**
  - Dockerfile
  - .dockerignore

### Deploy the container

- **EC2 instance ID:** i-09c2e3d81f4c383dd
- **Video timestamp:** 0:30

### User login

- **One line description:** You can login as a user or admin
- **Video timestamp:** 01:25 and 02:40
- **Relevant files:**
  - app.js
  - /public/login.html
  - /public/signup.html
  - /public/js/login.js
  - /public/js/signup.js
  - /public/js/jwt.js

### REST API

- **One line description:** The app.js file is the backend of the application, where all REST API endpoints are defined.
- **Video timestamp:** 03:30
- **Relevant files:**
  - app.js
  - /public/js/database.js
  - /public/js/script.js
  - /public/js/login.js
  - /public/js/signup.js
  - /persistence/sqlite.js

### Data types

- **One line description:** Unstructured and structured data types
- **Video timestamp:** 04:50
- **Relevant files:**
  - app.js
  - /public/js/script.js
  - /public/index.html
  - /public/js/database.js

#### First kind

- **One line description:** Storing the image: defined by line "req.file.buffer"
- **Type:** Unstructured
- **Rationale:** Image data is binary and cannot easily be queried or sorted in a structured manner.
- **Video timestamp:** 04:50
- **Relevant files:**
  - app.js

#### Second kind

- **One line description:** Storing info about image: name, label, contentType, classification and confidence of the image
- **Type:** Structured
- **Rationale:** Structured data such as text and numeric fields can be easily stored, queried, and sorted in a database.
- **Video timestamp:** 04:50
- **Relevant files:**
  - app.js

### CPU intensive task

**One line description:** Machine learning model (tensorflow) that classifies the image

- **Video timestamp:** 02:00
- **Relevant files:**
  - app.js

### CPU load testing

**One line description:** Load testing of the CPU on the EC2 instance

- **Video timestamp:** 04:00
- **Relevant files:**
  - app.js

## Additional criteria

### Web client

- **One line description:** Frontend web app with all endpoints
- **Video timestamp:** 1:05
- **Relevant files:**
  - /public/css/database.css
  - /public/css/home.css
  - /public/css/login.css
  - /public/css/navbar.css
  - /public/js/database.js
  - /public/js/login.js
  - /public/js/script.js
  - /public/js/signup.js
  - /public/database.html
  - /public/index.html
  - /public/login.html
  - /public/signup.html

### Extensive REST API features

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### External API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Additional types of data

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Custom processing

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Infrastructure as code

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Upon request

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
