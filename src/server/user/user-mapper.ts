// import type { User } from "@prisma/client";
// import type { UserDTO, AdminUserListItemDTO, AdminUserDetailDTO } from "@/types/user";

// export function toUserDTO(user: User): UserDTO {
//   return {
//     id: user.id,
//     phoneNumber: user.phoneNumber,
//     fullName: user.fullName,
//     nationalCode: user.nationalCode,
//     birthDate: user.birthDate ? user.birthDate.toISOString() : null,
//     email: user.email,
//     profilePicUrl: user.profilePicUrl,
//     role: user.role,
//     isActive: user.isActive,
//     createdAt: user.createdAt.toISOString(),
//     lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
//   };
// }

// export function toAdminUserListItemDTO(user: User): AdminUserListItemDTO {
//   return {
//     id: user.id,
//     phoneNumber: user.phoneNumber,
//     fullName: user.fullName,
//     role: user.role,
//     isActive: user.isActive,
//     isLocked: !!user.lockedUntil && user.lockedUntil.getTime() > Date.now(),
//     createdAt: user.createdAt.toISOString(),
//     lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
//   };
// }

// export function toAdminUserDetailDTO(user: User): AdminUserDetailDTO {
//   return {
//     ...toUserDTO(user),
//     ipAddress: user.ipAddress,
//     failedOtpAttempts: user.failedOtpAttempts,
//     lockedUntil: user.lockedUntil ? user.lockedUntil.toISOString() : null,
//     stats: {
//       totalOrders: 0, // TODO: wire once Order module exists
//       totalSpent: 0, // TODO: wire once Order module exists
//     },
//   };
// }








import type { User } from "@prisma/client";
import type { UserDTO, AdminUserListItemDTO, AdminUserDetailDTO } from "@/types/user";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    fullName: user.fullName,
    nationalCode: user.nationalCode,
    birthDate: user.birthDate ? user.birthDate.toISOString() : null,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
  };
}

export function toAdminUserListItemDTO(user: User): AdminUserListItemDTO {
  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    isLocked: !!user.lockedUntil && user.lockedUntil.getTime() > Date.now(),
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
  };
}

export function toAdminUserDetailDTO(
  user: User,
  stats: { totalOrders: number; totalSpent: number }
): AdminUserDetailDTO {
  return {
    ...toUserDTO(user),
    ipAddress: user.ipAddress,
    failedOtpAttempts: user.failedOtpAttempts,
    lockedUntil: user.lockedUntil ? user.lockedUntil.toISOString() : null,
    stats,
  };
}
