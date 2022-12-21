import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVandorInput>req.body;

  // If Vandor Already Exist Or Not
  const existingVandor = await Vandor.findOne({ email });

  if (existingVandor !== null) {
    return res.json({ message: "A Vandor already exist with this email ID" });
  }

  // Generate a Salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createVandor = await Vandor.create({
    name,
    address,
    pincode,
    foodType,
    email,
    password: userPassword,
    salt: salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  return res.json(createVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
