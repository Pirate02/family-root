import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import {
  createFamilySchema,
  createPersonSchema,
  createRelationshipSchema,
} from "../schemas/index.js";
import prisma from "../db.js";

export const createFamily = async (req: Request, res: Response) => {
  const parsed = createFamilySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { name } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: { name },
      });

      await tx.familyMember.create({
        data: {
          familyId: family.id,
          role: "admin",
          userId: req.userId!,
        },
      });

      return family;
    });

    res.status(201).json({
      message: "Family created successfully and you are the admin. ",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFamily = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const member = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId: id,
          userId: req.userId!,
        },
      },
    });

    if (!member) {
      res.status(403).json({ error: "Access denied! " });
      return;
    }
    const family = await prisma.family.findUnique({
      where: { id },
      include: {
        members: true,
        persons: true,
      },
    });

    if (!family) {
      res.status(404).json({ error: "Family not found !" });
      return;
    }

    res.status(200).json({
      data: family,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createPerson = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const familyId = req.params.id;

  const parsed = createPersonSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { name, gender, dob, dod, bio, picUrl } = parsed.data;

  try {
    const member = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId: familyId,
          userId: req.userId!,
        },
      },
    });

    if (!member || member.role === "viewer") {
      res.status(403).json({ error: "Access denied !" });
      return;
    }

    const person = await prisma.persons.create({
      data: {
        name,
        gender: gender ?? null,
        bio: bio ?? null,
        picUrl: picUrl ?? null,
        dob: new Date(dob).toISOString(),
        dod: dod ? new Date(dod).toISOString() : null, // if else statement of ternary operator.
        familyId,
      },
    });

    res
      .status(201)
      .json({ message: "Person added successfully! ", data: person });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllFamilyMembers = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const familyId = req.params.id;
  const userId = req.userId!;

  try {
    const member = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId: familyId,
          userId: userId,
        },
      },
    });

    if (!member) {
      res.status(403).json({ error: "Access denied ! " });
      return;
    }

    const familyMembers = await prisma.persons.findMany({
      where: { familyId: familyId },
    });

    res.status(200).json({ data: familyMembers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createRelationship = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const familyId = req.params.id;

  const userId = req.userId!;

  const parsed = createRelationshipSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { personAId, personBId, type } = parsed.data;

  try {
    const member = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });

    if (!member || member.role === "viewer") {
      res.status(403).json({ error: "Access denied !" });
      return;
    }

    if (personAId === personBId) {
      res
        .status(400)
        .json({ error: "One cannot have relationship with themselves" });
      return;
    }

    const persons = await prisma.persons.findMany({
      where: {
        id: { in: [personAId, personBId] },
        familyId: familyId,
      },
    });

    if (persons.length !== 2) {
      return res
        .status(404)
        .json({ error: "One or both person not found in this family" });
    }

    const relation = await prisma.relationship.create({
      data: {
        personAId,
        personBId,
        type,
      },
    });

    res.status(201).json({ message: "success", data: relation });
    return;
  } catch (err) {
    const newError = err as Prisma.PrismaClientKnownRequestError;

    if (newError.code === "P2002") {
      res.status(409).json({ error: "Relation already exists !" });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllRelationships = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.userId!;
  const familyId = req.params.id;

  try {
    const member = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ error: "Access denied !" });
    }

    const relationships = await prisma.relationship.findMany({
      where: {
        personA: {
          familyId: familyId,
        },
      },
    });


    return res.status(200).json({
      data: relationships.map(r=>({
        source: r.personAId,
        target: r.personBId,
        type: r.type

      }))


    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};




export const getMyFamilies = async(req:Request,res: Response)=> {
  const userId = req.userId!;

  try {

    const families = await prisma.familyMember.findMany({where: {userId}, include: {family: true}})
    if(families.length === 0){
      return res.status(404).json({message: "You are no associated with any family"})

    }

    res.status(200).json({data: families})
    
  } catch (error) {
    res.status(500).json({error: "Internal server error", err: error})
  }


}






