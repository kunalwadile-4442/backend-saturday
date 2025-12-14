import type { PaginationQuery, PaginationResult } from "../types";

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(1, Number.parseInt(String(query.page)) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(String(query.limit)) || 10)
  );
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sort: { [sortBy]: sortOrder },
  };
};

export const createPaginationResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
