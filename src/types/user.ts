// /**
//  * DTO ("Data Transfer Object") types — these describe exactly what shape
//  * of data the server sends to the client. We NEVER send the full Prisma
//  * User model to the client (it has otpCodeHash etc. — secrets).
//  */

// export type Role = "USER" | "ADMIN";

// /** Safe user shape — what the client is allowed to see about itself. */
// export type UserDTO = {
//   id: string;
//   phoneNumber: string;
//   fullName: string | null;
//   nationalCode: string | null;
//   birthDate: string | null; // ISO string, e.g. "1990-05-20T00:00:00.000Z"
//   email: string | null;
//   profilePicUrl: string | null;
//   role: Role;
//   isActive: boolean;
//   createdAt: string; // ISO string
//   lastLoginAt: string | null; // ISO string
// };

// /** Row shape in the admin user list table. */
// export type AdminUserListItemDTO = {
//   id: string;
//   phoneNumber: string;
//   fullName: string | null;
//   role: Role;
//   isActive: boolean;
//   isLocked: boolean; // computed: lockedUntil > now
//   createdAt: string;
//   lastLoginAt: string | null;
// };

// export type PaginatedResult<T> = {
//   items: T[];
//   page: number;
//   pageSize: number;
//   totalItems: number;
//   totalPages: number;
// };

// /**
//  * Detail shape for the admin "view single user" page.
//  * `stats` fields are stubs (0) until Orders module exists — TODO wire real data.
//  */
// export type AdminUserDetailDTO = UserDTO & {
//   ipAddress: string | null;
//   failedOtpAttempts: number;
//   lockedUntil: string | null;
//   stats: {
//     totalOrders: number; // TODO: wire once Order module exists
//     totalSpent: number; // TODO: wire once Order module exists
//   };
// };





/**
 * DTO ("Data Transfer Object") types — these describe exactly what shape
 * of data the server sends to the client. We NEVER send the full Prisma
 * User model to the client (it has otpCodeHash etc. — secrets).
 */

export type Role = "USER" | "ADMIN";

/** Safe user shape — what the client is allowed to see about itself. */
export type UserDTO = {
  id: string;
  phoneNumber: string;
  fullName: string | null;
  nationalCode: string | null;
  birthDate: string | null; // ISO string, e.g. "1990-05-20T00:00:00.000Z"
  email: string | null;
  profilePicUrl: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string; // ISO string
  lastLoginAt: string | null; // ISO string
};

/** Row shape in the admin user list table. */
export type AdminUserListItemDTO = {
  id: string;
  phoneNumber: string;
  fullName: string | null;
  role: Role;
  isActive: boolean;
  isLocked: boolean; // computed: lockedUntil > now
  createdAt: string;
  lastLoginAt: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

/**
 * Detail shape for the admin "view single user" page.
 * `stats` reflects real order data (CONFIRMED + COMPLETED orders only —
 * same "actually paid" rule used everywhere else in the app, e.g. Module 6
 * reports). PENDING (unpaid) and CANCELLED orders are excluded.
 */
export type AdminUserDetailDTO = UserDTO & {
  ipAddress: string | null;
  failedOtpAttempts: number;
  lockedUntil: string | null;
  stats: {
    totalOrders: number; // count of CONFIRMED + COMPLETED orders
    totalSpent: number; // Toman, sum of totalAmount for those orders
  };
};

