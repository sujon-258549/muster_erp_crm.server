import ApiError from "../../middleware/apiError.ts";
import status from "http-status";
import prisma from "../../utils/prismaClient.ts";
import { JwtHelpers } from "../../utils/jwtHelpers.ts";
import config from "../../config/index.ts";
import argon2 from "argon2";
import { sendEmail, otpEmailTemplate } from "../../utils/sendEmail.ts";
import { derivePermissionRows } from "../../utils/userPermissions.ts";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      role: { include: { rolePermissions: true } },
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  if (user.isBlocked) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ User is blocked");
  }

  if (user.isDeleted) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ User is deleted");
  }

  if (!user.isActive) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ User is not active");
  }

  if (user.loginTryCount >= 5) {
    const lastTryTime = user.loginTryTime
      ? new Date(user.loginTryTime).getTime()
      : 0;
    const currentTime = new Date().getTime();
    const timeDiff = (currentTime - lastTryTime) / (1000 * 60); // minutes

    if (timeDiff < 5) {
      const remainingTime = Math.ceil(5 - timeDiff);
      throw new ApiError(
        status.UNAUTHORIZED,
        `🔍❓ You have exceeded the maximum number of login attempts. Please try again after ${remainingTime} minutes or Forgot Password.`,
      );
    } else {
      // Reset the count if 5 minutes have passed
      await prisma.user.update({
        where: { id: user.id },
        data: { loginTryCount: 0 },
      });
      user.loginTryCount = 0;
    }
  }

  if (!user.password) {
    throw new ApiError(
      status.UNAUTHORIZED,
      "🔍❓ Account has no password set — use Forgot Password",
    );
  }
  const isPasswordCorrect = await argon2.verify(
    user.password,
    payload.password,
  );

  if (!isPasswordCorrect) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginTryCount: { increment: 1 }, loginTryTime: new Date() },
    });
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ Password is incorrect");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      loginCount: { increment: 1 },
      loginTryCount: 0,
      loginTryTime: null,
    },
  });

  const payloadData = {
    id: user.id,
    email: user.email,
    role: user.role?.role,
    mobile: user.mobile,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    isVerified: user.isVerified,
    isActive: user.isActive,
    passwordChanged: user.passwordChanged,
    passwordChangeTime: user.passwordChangeTime,
    loginTryCount: user.loginTryCount,
    loginTryTime: user.loginTryTime,
    lastLogin: user.lastLogin,
    loginCount: user.loginCount,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret,
    config.accessExpire,
  );
  const refreshToken = JwtHelpers.generateToken(
    payloadData,
    config.refreshSecret,
    config.refreshExpire,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      name: user.profile?.name,
      photo: user.profile?.profilePhoto?.url,
      role: user.role?.role,
      gender: user.profile?.gender,
      bloodGroup: user.profile?.bloodGroup,
      age: user.profile?.age,
      designation: user.workInfo?.experience,
      department: user.department?.name,
      address: user.address,
      workInfo: {
        ...user.workInfo,
        subCategories: user.workInfo?.subCategories?.map((s) => s.name),
        workTypes: user.workInfo?.workTypes?.map((w) => w.name),
      },
      isActive: user.isActive,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      isDeleted: user.isDeleted,
      permissions: derivePermissionRows(user.role),
    },
    isLogin: true,
  };
};

const refreshToken = async (token: string) => {
  const decoded = JwtHelpers.verifyToken(token, config.refreshSecret as string);

  const { email, iat } = decoded?.data || (decoded as any);
  
  // check if user exist
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: email },
    include: {
      role: { include: { rolePermissions: true } },
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  if (
    user.passwordChangeTime &&
    Math.floor(new Date(user.passwordChangeTime).getTime() / 1000) > iat
  ) {
    throw new ApiError(
      status.UNAUTHORIZED,
      "🔍❓ Password recently changed. Please login again.",
    );
  }

  console.log(user);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const payloadData = {
    id: user.id,
    email: user.email,
    role: user.role?.role,
    mobile: user.mobile,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    isVerified: user.isVerified,
    isActive: user.isActive,
    passwordChanged: user.passwordChanged,
    passwordChangeTime: user.passwordChangeTime,
    loginTryCount: user.loginTryCount,
    loginTryTime: user.loginTryTime,
    lastLogin: user.lastLogin,
    loginCount: user.loginCount,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret,
    config.accessExpire,
  );
  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      name: user.profile?.name,
      photo: user.profile?.profilePhoto?.url,
      role: user.role?.role,
      gender: user.profile?.gender,
      bloodGroup: user.profile?.bloodGroup,
      age: user.profile?.age,
      designation: user.workInfo?.experience,
      department: user.department?.name,
      address: user.address,
      workInfo: {
        ...user.workInfo,
        subCategories: user.workInfo?.subCategories?.map((s) => s.name),
        workTypes: user.workInfo?.workTypes?.map((w) => w.name),
      },
      isActive: user.isActive,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      isDeleted: user.isDeleted,
      permissions: derivePermissionRows(user.role),
    },
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
    include: { profile: true },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const generateOtp = Math.floor(100000 + Math.random() * 900000);

  if (!user.email) {
    throw new ApiError(status.BAD_REQUEST, "🔍❓ Account has no email on file");
  }
  const emailData: { name?: string; otp: number } = {
    otp: generateOtp,
  };
  if (user.profile?.name) {
    emailData.name = user.profile.name;
  }

  const otpSent = await sendEmail(
    user.email,
    otpEmailTemplate(emailData),
    "Your OTP Code",
  );

  await prisma.otp.upsert({
    where: { email: user.email },
    update: {
      otpToken: generateOtp.toString(),
      updatedAt: new Date(),
    },
    create: {
      email: user.email,
      otpToken: generateOtp.toString(),
    },
  });
  return { message: "OTP sent to your email" };
};

const resetPassword = async (email: string, password: string, otp: string) => {
  

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: email },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const otpData = await prisma.otp.findUniqueOrThrow({
    where: { email: email },
  });
  if (!otp) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ OTP not Found");
  }

  const expireTime = new Date(otpData.updatedAt).getTime() + 1000 * 60 * 5;

  if (Date.now() > expireTime) {
    throw new Error("OTP expired");
  }

  if (otpData.otpToken !== otp) {
    throw new ApiError(status.BAD_REQUEST, "🔍❓ OTP is incorrect");
  }

  const hashedPassword = await argon2.hash(password);
  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: {
      password: hashedPassword,
      passwordChanged: true,
      passwordChangeTime: new Date(),
    },
    include: {
      role: true,
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  const payloadData = {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role?.role,
    mobile: updatedUser.mobile,
    isBlocked: updatedUser.isBlocked,
    isDeleted: updatedUser.isDeleted,
    isVerified: updatedUser.isVerified,
    isActive: updatedUser.isActive,
    passwordChanged: updatedUser.passwordChanged,
    passwordChangeTime: updatedUser.passwordChangeTime,
    lastLogin: updatedUser.lastLogin,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret as string,
    config.accessExpire as string,
  );
  const refreshToken = JwtHelpers.generateToken(
    payloadData,
    config.refreshSecret as string,
    config.refreshExpire as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      name: updatedUser.profile?.name,
      photo: updatedUser.profile?.profilePhoto?.url,
      role: updatedUser.role?.role,
      gender: updatedUser.profile?.gender,
      bloodGroup: updatedUser.profile?.bloodGroup,
      age: updatedUser.profile?.age,
      designation: updatedUser.workInfo?.experience,
      department: updatedUser.department?.name,
      address: updatedUser.address,
      workInfo: {
        ...updatedUser.workInfo,
        subCategories: updatedUser.workInfo?.subCategories?.map((s) => s.name),
        workTypes: updatedUser.workInfo?.workTypes?.map((w) => w.name),
      },
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
      isBlocked: updatedUser.isBlocked,
      isDeleted: updatedUser.isDeleted,
    },
    isLogin: true,
  };
};
export const AuthServices = {
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
