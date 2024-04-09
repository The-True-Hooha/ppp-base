import { NextResponse } from "next/server";
import { prisma } from "../../../../../../config/prisma.connect";
import { getAuthUser } from "../../../../../../lib/get-auth-user";
import ApiResponseDto from "../../../../../../lib/apiResponseHelper";
import hashPassword from "../../../../../../lib/hashHelper";

export async function PATCH(req, context) {
  try {
    const authResponse = await getAuthUser(req, true);
    if (authResponse.error) {
      return NextResponse.json(
        ApiResponseDto({
          statusCode: authResponse.status,
          message: authResponse.error.message,
        }),
        { status: authResponse.status }
      );
    }
    if (authResponse.user.role !== "ADMIN") {
      return NextResponse.json(
        ApiResponseDto({ message: "not allowed to access this route" }),
        {
          status: 403,
        }
      );
    }
    const searchParams = req.nextUrl.searchParams;
    const { params } = context;
    const getId = params.id;
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const phoneNumber = searchParams.get("phoneNumber");
    const address = searchParams.get("address");
    const gender = searchParams.get("gender");
    const role = searchParams.get("role");
    const password = searchParams.get("password");
    const getPersonnel = await prisma.user.update({
      where: {
        id: getId,
      },
      data: {
        address: address ? address : undefined,
        email: email ? email : undefined,
        gender: gender ? gender : undefined,
        name: name ? name.toLowerCase() : undefined,
        password: password ? await hashPassword(password) : undefined,
        phoneNumber: phoneNumber ? phoneNumber : undefined,
        ...(role && role === "MANAGEMENT"
          ? {
              Management: {
                connect: {
                  user: {
                    id: getId,
                  },
                },
              },
            }
          : role === "ADMIN"
          ? {
              Admin: {
                connect: {
                  user: {
                    id: getId,
                  },
                },
              },
            }
          : {
              personnel: {
                connect: {
                  user: {
                    id: getId,
                  },
                },
              },
            }),
      },
    });
    if (role) {
      await prisma.personnel.delete({
        where: {
          user: getId,
        },
      });
    }
    return NextResponse.json(
      ApiResponseDto({
        statusCode: 200,
        data: getPersonnel,
        message: "successful",
      }),
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message, error: err },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const authResponse = await getAuthUser(req, true);
    if (authResponse.error) {
      return NextResponse.json(
        ApiResponseDto({
          statusCode: authResponse.status,
          message: authResponse.error.message,
        }),
        { status: authResponse.status }
      );
    }
    if (authResponse.user.role !== "ADMIN") {
      return NextResponse.json(ApiResponseDto({ message: "not allowed" }), {
        status: 403,
      });
    }
    const { params } = context;
    const getId = params.id;
    const getCustomer = await prisma.personnel.findUnique({
      where: {
        personnelId: getId,
      },
      include: {
        user: true,
        personnelPerformance: true,
        Product: true,
      },
    });
    if (!getCustomer) {
      return NextResponse.json(
        ApiResponseDto({
          statusCode: 404,
          message: "user details not found",
        }),
        { status: 404 }
      );
    }
    await prisma.customer.delete({
      where: {
        customerId: getUserId,
      },
      include: {
        poc: true,
        Voucher: true,
      },
    });
    return NextResponse.json(
      ApiResponseDto({
        statusCode: 200,
        message: "successfully deleted customer",
      }),
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message, error: err },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  try {
    const authResponse = await getAuthUser(req, true);
    if (authResponse.error) {
      return NextResponse.json(
        ApiResponseDto({
          statusCode: authResponse.status,
          message: authResponse.error.message,
        }),
        { status: authResponse.status }
      );
    }
    if (authResponse.user.role !== "ADMIN") {
      return NextResponse.json(
        ApiResponseDto({ message: "you are not allowed to access this route" }),
        {
          status: 403,
        }
      );
    }
    const { params } = context;
    const id = params.id;
    const getUserData = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Management: true,
        Admin: true,
        personnel: true,
      },
    });
    // todo: map response
    if (!getUserData) {
      return NextResponse.json(
        ApiResponseDto({
          statusCode: 404,
          message: "user details not found",
        }),
        { status: 404 }
      );
    }
    return NextResponse.json(
      ApiResponseDto({
        statusCode: 200,
        data: getUserData,
        message: "successful",
      }),
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.message, error: err },
      { status: 500 }
    );
  }
}
