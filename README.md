This is a [Next.js](https://nextjs.org/) project bootstrapped with Next Auth and Mysql.

## Create Next App using this template

```bash
npx create-next-app -e https://github.com/AdityaSawant0912/next-nextauth-mysql-template [project-name]
```

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Learn More about APIs

# User API

- GET http://localhost:3000/api/user - Redirects to GET http://localhost:3000/api/user/:userID

- POST http://localhost:3000/api/user - Register User. Body: {firstName, lastName, email, password}

- PUT http://localhost:3000/api/user - Reset user password. Body: {oldPassword, newPassword}

- DELETE http://localhost:3000/api/user - Redirects to DELETE http://localhost:3000/api/user/:userID

- GET http://localhost:3000/api/user/:userID - Get User by ID

- PUT http://localhost:3000/api/user/:userID - Update User by ID. Body: {firstName, lastName}

- DELETE http://localhost:3000/api/user/:userID - Delete User by ID. NOT IMPLEMENTED

- GET http://localhost:3000/api/user/:userID/role - Get User Role by ID

- PUT http://localhost:3000/api/user/:userID/role - Update User Role by ID. Body: {role}


## Database

### Database Schema is saved in the root directory as "template.sql"

### Update the database credentials in the .env file


## Next Auth

### Update the credentials in the .env file

### Do not change the NEXTAUTH_URL in the .env file. Unless you are using a custom domain.
