import { NextResponse } from "next/server";
import { prisma } from "../../../../config/prisma.connect";
import bcrypt from "bcrypt";
import ApiResponseDto from "../../../../lib/apiResponseHelper";
import { signIn_validate } from "../../../../lib/validate";
import _isUserAvailable from "../../../../repo/check-user-available";
import createAccessToken from "../../../../lib/sign-jwt";
import { serialize } from "cookie";

export async function POST(req, res) {
  const body = await req.json();
  const error = signIn_validate(body);
  const handleError = ApiResponseDto({
    message: "validation error",
    data: null,
    error: error,
    statusCode: 400,
  });
  if (Object.keys(error).length > 0)
    return NextResponse.json(handleError, { status: 400 });

  const { email, password, role } = body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return NextResponse.json(
        ApiResponseDto({ message: "Invalid user email or password" }),
        { status: 403 }
      );
    }
    if (user.role !== role)
      return NextResponse.json(
        { message: "not allowed, incorrect roles", statusCode: 400 },
        { status: 400 }
      );
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return NextResponse.json(
        ApiResponseDto({
          message: "incorrect email or password",
          statusCode: 401,
        }),
        { status: 401 }
      );
    const setToken = createAccessToken(user.id, user.email, user.role);
    const atCookie = serialize("ppp-base", setToken, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 60 * 60 * 24 * 7, // expires in 1 week
      path: "/",
    });
    const loginResponse = ApiResponseDto({
      message: "login successful",
      data: {
        user: user,
      },
      statusCode: 200,
    });
    return NextResponse.json(loginResponse, {
      status: 200,
      headers: { "Set-Cookie": atCookie },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, status: 500 },
      { status: 500 }
    );
  }
}
