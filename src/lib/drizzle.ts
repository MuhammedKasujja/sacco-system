// import { users } from "@/db/schema";
// import { asc } from "drizzle-orm";

// function withPagination<T extends any>(qb: T, page: number, pageSize = 20) {
//   return qb
//     .offset((page - 1) * pageSize)
//     .limit(pageSize)
//     .orderBy(asc(users.id));
// }