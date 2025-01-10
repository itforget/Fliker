import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedData = loginSchema.parse(body);
    const { email, password } = parsedData;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const payload = {
      userId: user.id,
      username: user.name,
      email: user.email,
    };
     
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const { password: userPassword, ...userWithoutPassword } = user;
    return NextResponse.json({ token, user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors.map((err) => err.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
}