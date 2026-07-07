import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'password' | 'refreshToken'>;

export function sanitizeUser(user: User): SafeUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    status: user.status,
    role: user.role,
    isActive: user.isActive,
    agencyId: user.agencyId,
    agencyName: user.agencyName,
    commissionVisibility: user.commissionVisibility,
    brnId: user.brnId,
    onboardId: user.onboardId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
