import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain letters and at least one special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = userSchema.parse(body);
    const { name, email, password } = parsedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
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
      { message: "Error registering user", error },
      { status: 500 }
    );
  }
}