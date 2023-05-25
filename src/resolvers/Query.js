function feed(parent, args, context) {
  return context.prisma.post.findMany();
}

function getPostById(parent, args, context) {
  return context.prisma.post.findUnique({ where: { id: parseInt(args.id) } });
}

module.exports = {
  feed,
  getPostById,
};
