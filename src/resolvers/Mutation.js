const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const updated_at = new Date(Date.now());
  const user = await context.prisma.user.create({
    data: { ...args, password, updated_at },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;
  const updated_at = new Date(Date.now());

  return await context.prisma.post.create({
    data: {
      title: args.title,
      content: args.content,
      author: { connect: { id: userId } },
      updated_at,
    },
  });
}

async function edit(parent, args, context, info) {
  const { userId } = context;
  const updated_at = new Date(Date.now());
  const author = await context.prisma.post
    .findUnique({ where: { id: parseInt(args.id) } })
    .author();

  if (author.id !== userId) {
    throw new Error("You are not allowed to edit this post");
  }

  return await context.prisma.post.update({
    where: {
      id: parseInt(args.id),
    },
    data: {
      title: args.title,
      content: args.content,
      updated_at,
    },
  });
}
async function deletePost(parent, args, context, info) {
  const { userId } = context;
  const author = await context.prisma.post
    .findUnique({ where: { id: parseInt(args.id) } })
    .author();

  if (author.id !== userId) {
    throw new Error("You are not allowed to delete this post");
  }

  await context.prisma.post.delete({
    where: {
      id: parseInt(args.id),
    },
  });

  return true;
}

async function comment(parent, args, context, info) {
  const { userId } = context;
  const updated_at = new Date(Date.now());

  return await context.prisma.postComment.create({
    data: {
      content: args.content,
      post: { connect: { id: parseInt(args.id) } },
      author: { connect: { id: userId } },
      updated_at,
    },
  });
}

module.exports = {
  signup,
  login,
  post,
  edit,
  deletePost,
  comment,
};
