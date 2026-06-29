import type { Request, Response } from "express";

import 'dotenv/config'

import { Prisma } from "../generated/prisma/client.js";

import bcrypt from "bcrypt";

import prisma from "../db.js";

import { registerSchema, loginSchema } from "../schemas/index.js";

import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { name, email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const { passwordHash: _, ...safeUser } = user; // take hashpassword from user; put it in the variable _ and the rest into ...safeUser .

    res.status(201).json({
      user: safeUser,
      message: "User created successfully.",
    });
  } catch (error) {
    const newError = error as Prisma.PrismaClientKnownRequestError;

    if (newError.code === "P2002") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// login

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const matchPassword = await bcrypt.compare(password, user.passwordHash);

    if (!matchPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: '7d'}) // payload, secret , options

    const {passwordHash: _, ...safeUser} = user;

    res.status(200).json({
      user: safeUser,
      token

    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error !" });
  }
};
