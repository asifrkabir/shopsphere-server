# ShopSphere Server

Welcome to the ShopSphere Server! This application serves as the backend for the ShopSphere platform, providing APIs for user authentication, vendor and product management, order processing, and more. Below are the instructions on how to set up and run the application locally.

## Key Features

- User Authentication: Secure JWT-based login, registration, and password reset.
- Vendor Management: APIs for managing shops, products, and order history.
- Cart and Checkout: Endpoints to handle cart operations and integrate with Stripe for payment processing.
- Admin Features: Control over users, vendors, and product categories.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- MongoDB

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/asifrkabir/shopsphere-server

```

2. Navigate to the project directory:

```bash
cd shopsphere-server

```

3. Install dependencies::

```bash
npm install

```

## Configuration

1. Create a .env file in the root directory of the project.

2. Add the following environment variables to the .env file:

```plaintext
NODE_ENV=development
PORT=5000
DATABASE_URL={}
CLIENT_URL={}

# Authentication
BCRYPT_SALT_ROUNDS={}
DEFAULT_PASSWORD={}
JWT_ACCESS_SECRET={}
JWT_ACCESS_EXPIRES_IN={}
JWT_REFRESH_SECRET={}
JWT_REFRESH_EXPIRES_IN={}
JWT_RESET_SECRET={}

# Sendgrid
SENDGRID_API_KEY={}
SENDGRID_EMAIL={}

# Nodemailer
NODEMAILER_EMAIL={}
NODEMAILER_PASSWORD={}

# Cloudinary
CLOUDINARY_CLOUD_NAME={}
CLOUDINARY_API_KEY={}
CLOUDINARY_API_SECRET={}

# Stripe
STRIPE_SECRET_KEY={}
```

Adjust the values to match your application.

## Running the Application

To start the application, run the following command:

```bash
npm run start:dev

```

The application will be running at http://localhost:5000.
