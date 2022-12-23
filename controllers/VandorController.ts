import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInputs } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Vandor } from "../models";
import { Food } from "../models/Food";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;

  const existingUser = await FindVandor("", email);

  if (existingUser !== null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      });
      return res.json(signature);
    }
  }

  return res.json({ message: "Login credential is not valid" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVandor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: "vendor Information Not Found" });
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <EditVandorInputs>req.body;

  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.foodType = foodType;
      existingVandor.phone = phone;

      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information Not found" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information Not found" });
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vandor.coverImages.push(...images);

      const result = await vandor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Something went wrong with add" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodInputs
  >req.body;

  if (user) {
    const vendor = await FindVandor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      console.log(req.files);
      const images = files.map((file: Express.Multer.File) => file.filename);

      const food = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        rating: 0,
        readyTime: readyTime,
        foodType: foodType,
        images: images,
      });

      vendor.foods.push(food);
      const result = await vendor.save();
      return res.json(result);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: "Foods information Not found" });
};
