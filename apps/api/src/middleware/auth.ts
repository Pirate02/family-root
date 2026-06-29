import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided !" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid or exprired token !" });
  }
};
