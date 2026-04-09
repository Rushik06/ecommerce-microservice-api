import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { userCreateSchema } from "../schemas";
import becrypt from "bcryptjs";
import axios from "axios";
import { EMAIL_SERVICE_URL, USER_SERVICE_URL } from "@/config";

const generateVerificationCode = () => {
  const timeStamp = Date.now().toString();
  const randomNumber = Math.floor(10 + Math.random() * 90);

  const code = `${timeStamp}${randomNumber}`.slice(-5);

  return code;
};

const userRegistion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //validate the request body
    const parseBody = userCreateSchema.safeParse(req.body);

    if (!parseBody.success) {
      res.status(400).json({ error: parseBody.error.errors });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        name: parseBody.data.name,
      },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    //hash password
    const hashPassword = await becrypt.hash(parseBody.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parseBody.data.name,
        email: parseBody.data.email,
        password: hashPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        veryfied: true,
        status: true,
        createdAt: true,
      },
    });

    console.log("User created successfully", user);

    await axios.post(`${USER_SERVICE_URL}/users`, {
      authUserId: user.id,
      name: user.name,
      email: user.email,
    });

    //Generate Verification code

    const verificationCode = generateVerificationCode();

    await prisma.veryficationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    //Code send to user by email
    await axios.post(`${EMAIL_SERVICE_URL}/email/send`, {
      recipient: user.email,
      subject: "Email Verification",
      body: `Your verification code is ${verificationCode}`,
      source: "User Registion",
    });

    res
      .status(201)
      .json({
        message: "User created, check your email for verification code",
        user,
      });
  } catch (error) {
    next(error);
  }
};

export default userRegistion;
