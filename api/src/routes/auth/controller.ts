import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./schema.js";
import bcrypt from "bcrypt";
import { cookieOptions, generateToken } from "./utils.js";
import { schema } from "../../lib/database/index.js";

class Controller {
  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { email, password } = req.body;

    const user = await schema.User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    const { name, username, email, password } = req.body;

    const existUser = await schema.User.findOne({ email }).lean();

    if (existUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await schema.User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async logout(req: Request, res: Response) {
    const { httpOnly, secure, sameSite } = cookieOptions;
    res.clearCookie("token", { httpOnly, secure, sameSite });
    res.json({ message: "Logged out successfully" });
  }
}

export default new Controller();
