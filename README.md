# Enterprise Distributed Systems Project

# Etsy Clone - Ecommerce Platform using REST (Node.js) and React JS

This project is an Etsy clone built using the tech stack of MySQL, Express, React, Node.js. It aims to replicate core functionalities of Etsy such as user authentication, product listings, shopping cart, order history, and shop management.

## Table of Contents

- [Demo Video](#-demo-video)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 📺 Demo Video

Check out this short video demonstration to see Etsy Clone in action:

[![Etsy Clone Demo Video](https://img.youtube.com/vi/kAzKOAmTkGc/0.jpg)](https://youtu.be/kAzKOAmTkGc)

## Features

- User registration and authentication
- Browse products by category
- Product details page
- Shopping cart functionality
- Checkout process
- Order history
- Shop management for sellers

## Tech Stack

- **Frontend**: React, Redux, Bootstrap, Axios
- **Backend**: Node.js, Express, MySQL

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/rohanbhadreshpatel/etsy-clone.git
   ```
2. Install dependencies for backend and frontend

   ```sh
   cd etsy-clone/backend
   npm install

   cd ../frontend
   npm install
   ```

## Configuration

1. Create a `config.json` file in the `backend/src` directory with the following content:

   ```json
   {
     "DB": {
       "host": "your-db-host",
       "username": "your-db-username",
       "password": "your-db-password",
       "port": 3306,
       "database": "your-db-name"
     },
     "frontEnd": "http://localhost:3000"
   }
   ```

   Replace the placeholders with your MySQL database configuration details.

2. Update the `API` constant in `frontend/src/backend.js` if your backend server is running on a different host or port:
   ```js
   export const API = "http://localhost:8000";
   ```

## Usage

1. Start the backend server
   ```sh
   cd etsy-clone/backend
   node index.js
   ```
2. Start the frontend development server

   ```sh
   cd etsy-clone/frontend
   npm start
   ```

3. Open http://localhost:3000 in your browser

## Project Structure

```
etsy-clone/
  backend/
    public/
    src/
      config.json
      connectionPooling.js
      index.js
    package.json
  frontend/
    public/
    src/
      Components/
      Redux/
      App.js
      backend.js
      index.js
    package.json
  .gitignore
  README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
