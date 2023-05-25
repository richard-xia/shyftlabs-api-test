const fetch = require("isomorphic-fetch");

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

//Variables for storing test data
const username = makeid(10); //username of new user
var token; //authorization token
var id; //id of new post

// Test to get all posts
test("get all posts", async () => {
  const res = await fetch("http://localhost:4000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `feed {
                id
                title
                content
            }`,
    }),
  });
  const { data } = await res.json();
  const expectedResult = data;

  await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `feed {
            id
            title
            content
        }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});

// Test to register new user
test("register user", async () => {
  // Expected result from GraphQL API
  const expectedResult = {
    signup: {
      user: {
        username: username,
      },
    },
  };

  await fetch("http://localhost:4000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation {
                signup (username: "${username}", email: "${username}@prisma.io", password: "graphql") {
                    user {
                        username
                    }
                }
            }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});

// Test to login user
test("login user", async () => {
  // Expected result from GraphQL API
  const expectedResult = {
    username: username,
  };

  // Obtain authorization token
  const res = await fetch("http://localhost:4000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `mutation {
                      login (email: "${username}@prisma.io", password: "graphql") {
                          token
                          user {
                            username
                          }
                      }
                  }`,
    }),
  });
  const { data } = await res.json();
  //Obtain authorization token for other tests
  token = data.login.token;
  await expect(data.login.user).toStrictEqual(expectedResult);
});

// Create new post
test("create post", async () => {
  const expectedResult = {
    post: {
      title: "Create Test Post",
      content: "This is a unit test for creating a post",
    },
  };
  const res = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation {
                    post(title: "Create Test Post", content: "This is a unit test for creating a post") {
                        id
                        title
                        content
                    }
                }`,
    }),
  });
  const { data } = await res.json();
  id = data.post.id;
  delete data.post.id;
  await expect(data).toStrictEqual(expectedResult);
});

// Update post
test("update post", async () => {
  const expectedResult = {
    edit: {
      title: "Update Test Post",
      content: "This is a unit test for updating a post",
    },
  };
  await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation {
                      edit(id: ${id}, title: "Update Test Post", content: "This is a unit test for updating a post") {
                          title
                          content
                      }
                  }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});

// Post comment
test("post comment", async () => {
  const expectedResult = {
    comment: {
      content: "This is a unit test for posting a comment",
    },
  };
  await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation {
                    comment(id: ${id}, content: "This is a unit test for posting a comment") {
                            content
                        }
                    }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});

// Get post by id
test("get post by id", async () => {
  const expectedResult = {
    getPostById: {
      id,
      title: "Update Test Post",
      content: "This is a unit test for updating a post",
    },
  };
  await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
                    getPostById(id: ${id}) {
                            id
                            title
                            content
                        }
                    }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});

// Delete post
test("delete post", async () => {
  const expectedResult = {
    deletePost: true,
  };
  await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `mutation {
                        deletePost(id: ${id})
                    }`,
    }),
  })
    .then(res => res.json())
    .then(res => expect(res.data).toStrictEqual(expectedResult));
});
