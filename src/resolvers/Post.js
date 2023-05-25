function author(parent, args, context) {
  return context.prisma.post.findUnique({ where: { id: parent.id } }).author();
}

function comments(parent, args, context) {
  return context.prisma.post
    .findUnique({ where: { id: parent.id } })
    .comments();
}

module.exports = {
  author,
  comments,
};
