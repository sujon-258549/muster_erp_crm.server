export const calculatePaginationOrSort = (
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ) => {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (Number(pageNumber) - 1) * Number(limitNumber);
    const sortOrderValue = sortOrder ? sortOrder : "desc";
    const sortByValue = sortBy ? sortBy : "createdAt";
    return { pageNumber, limitNumber, skip, sortOrderValue, sortByValue };
  };