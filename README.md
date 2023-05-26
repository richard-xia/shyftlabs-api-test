# GraphQL Blog API

This project is prepared for Shyftlabs as part of the API Developer Test by Richard Xia.

This uses [Apollo Server] as a GraphQL server and [Prisma] for connecting to PostgreSQL and for ORM.

## Table of Contents

- [Getting Started](#getting-started)
  - [Tools Required](#tools-required)
  - [Installation](#installation)
- [Running the App](#running-the-app)
- [GraphQL API](#graphql-api)
  - [Signup](#signup)
  - [Login](#login)
  - [Create Post](#create-post)
  - [Edit Post](#edit-post)
  - [Delete Post](#delete-post)
  - [Post Comment](#post-comment)
  - [Get All Posts](#get-all-posts)
  - [Get Post By ID](#get-post-by-id)
- [Unit Testing](#unit-testing)

## Getting Started

The root folder of this project is contained in the `src` directory including the GraphQL schema and resolvers.

The `prisma` folder contains the `prisma.schema` for compiling the SQL database.

```
	shyftlabs-api-test
	├── .dockerignore
	├── .env
	├── .gitignore
	├── api.test.js
	├── docker-compose.yml
	├── Dockerfile
	├── package-lock.json
	├── package.json
	├── readme.md
	├── prisma
	│   └── schema.prisma
	└── src
		├── index.js
		├── schema.graphql
		├── script.js
		├── utils.js
		└── resolvers
		    ├── Mutation.js
		    ├── Post.js
		    ├── Query.js
		    └── User.js

```

### Tools Required

The only tool required to compile this project is Docker. You will also need to have access to Docker CLI either from Docker Desktop or directly using the container id.

## Running the App

1. The entire application can be created from the `docker-compose.yml` file.

```
  shyftlabs-api-test> docker-compose up
```

This will spawn 3 containers on ports 4000, 5432 and 5555.

2. After all 3 services have been started enter the Docker CLI for the `shyftlabs-api` container running on port 4000.

- In order to sync the database with prisma and graphQL run `npx prisma generate dev --name init` in the `shyftlabs-api` container

```
    # npx prisma migrate dev --name init
```

3. In order to load the test data you will need to run the script in `src/script.js`. This can be done directly in the same `shyftalbs-api` container.

```
    # node src/script.js
```

<br/>
<hr/>
<br/>

The GraphQL API is hosted on port 4000. This will open the GraphQL playground where you can query the server directly.

<img src="https://raw.githubusercontent.com/richard-xia/just-images/master/shyftlabs/graphql-playground.jpg" />

## GraphQL API

### Signup

```
mutation {
  signup(username: "Richard", email: "richard@prisma.io", password: "graphql") {
    user {
      username
    }
  }
}
```

### Login

```
mutation {
  login(email: "richard@prisma.io", password: "graphql") {
    token
  }
}
```

### Create Post

```
mutation {
  post(title: "www.shyftlabs.io", content: "GraphQL is awesome!") {
    title
    content
  }
}
```

### Edit Post

```
mutation {
  edit(id: 1, title: "www.google.ca", content: "GraphQL is the best!") {
    title
    content
  }
}
```

### Delete Post

```
mutation {
  deletePost(id: 1)
}
```

### Post Comment

```
mutation {
  comment(content: "Hello World!", id: 1) {
    content
  }
}
```

### Get All Posts

```
query {
  feed {
    id
    title
    content
    author {
      id
    }
    comments {
      content
    }
  }
}
```

### Get Post by ID

```
query {
  getPostById (id: 1) {
    id
    title
    content
    author {
      id
    }
  }
}
```

## Unit Testing

Unit testing is performed using jest. The `api.test.js` file contains the tests for each GraphQL endpoint.

```
shyftlabs-api-test> npm test
```

[//]: # "HyperLinks"
[Apollo Server]: https://github.com/apollographql/apollo-server
[Prisma]: https://github.com/prisma/prisma
