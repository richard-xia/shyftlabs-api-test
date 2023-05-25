const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  const users = [];
  for (var i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        updated_at: new Date(Date.now()),
      },
    });
    users.push(user);
  }
  console.log("Generated 5 random users");

  for (var i = 0; i < 100; i++) {
    var randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.post.create({
      data: {
        title: faker.lorem.words(),
        content: faker.lorem.paragraph(),
        author: { connect: { id: randomUser.id } },
        updated_at: new Date(Date.now()),
      },
    });
  }
  console.log("Generated 100 random posts");
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
