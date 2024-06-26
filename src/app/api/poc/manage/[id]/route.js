import { prisma } from "../../../../../../config/prisma.connect";
import { getAuthUser } from "../../../../../../lib/get-auth-user";
import { NextResponse } from "next/server";
import ApiResponseDto from "../../../../../../lib/apiResponseHelper";

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
      return NextResponse.json(ApiResponseDto({ message: "not allowed" }), {
        status: 403,
      });
    }
    const { params } = context;
    const getPocId = params.id;
    const searchParams = req.nextUrl.searchParams;
    const user_Id = searchParams.get("user_Id");
    const allocationId = searchParams.get("allocationId");

    if (user_Id) {
      const findUser = await prisma.user.findUnique({
        where: {
          id: user_Id,
        },
        include: {
          management: true,
          personnel: true,
        },
      });
      if (!findUser) {
        return NextResponse.json(
          ApiResponseDto({ message: "email not found" }),
          {
            status: 404,
          }
        );
      }
      const getM = findUser.management.find((m) => m.userId === findUser.id);
      const getP = findUser.personnel.find((p) => p.userId === findUser.id);
      const removePocDetails = await prisma.pointOfConsumption.update({
        where: {
          id: getPocId,
        },
        data: {
          ...(findUser.role === "MANAGEMENT"
            ? {
                management: {
                  disconnect: {
                    id: getM.id,
                  },
                },
              }
            : {
                personnel: {
                  disconnect: {
                    id: getP.id,
                  },
                },
              }),
        },
      });
      return NextResponse.json(
        ApiResponseDto({
          statusCode: 200,
          data: removePocDetails,
          message: "successful",
        }),
        { status: 200 }
      );
    }
    if (allocationId) {
      const updatePoc = await prisma.productAllocation.delete({
        where: {
          id: allocationId,
        },
      });
      return NextResponse.json(
        ApiResponseDto({
          statusCode: 200,
          data: updatePoc,
          message: "successful",
        }),
        { status: 200 }
      );
    }
    return NextResponse.json(
      ApiResponseDto({
        statusCode: 200,
        data: "no update queried",
        message: "OK",
      }),
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message, status: 500 });
  }
}
