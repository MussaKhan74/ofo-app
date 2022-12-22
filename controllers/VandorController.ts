import { Request, Response, NextFunction } from "express";
import { VandorLoginInputs } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        foodType: existingVandor.foodType,
        name: existingVandor.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Invalid Credentials" });
    }
  }

  return res.json({ message: "Login credential not valid" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
