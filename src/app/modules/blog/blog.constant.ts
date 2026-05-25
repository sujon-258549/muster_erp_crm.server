export const BlogConstants = {
  DEFAULT_LIMIT: 10,
  DEFAULT_SORT: "desc",
};

export const blogSearchableFields = [
  "title",
  "description",
  "excerpt",
  "authorName",
  "slug",
  "tags",
];

export const blogFilterableFields = [
  "searchTerm",
  "category",
  "isPublished",
  "slug",
  "authorId",
  "createdAt",
  "updatedAt",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
];
