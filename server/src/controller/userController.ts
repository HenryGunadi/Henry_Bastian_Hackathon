import { NextFunction, Request, Response } from "express";
import UserStore from "../services/userStore";
import User from "../../db/models/user";
import { generateNonce } from "@meshsdk/core";
import BadRequestError from "../classes/BadRequestError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserController {
  // attributes
  private _store: UserStore;
  private secret: string | "";

  // constructor
  constructor(store: UserStore) {
    this._store = store;
    this.secret = process.env.ACCESS_TOKEN_SECRET || "";
  }

  // methods
  login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // handle request body
    try {
      const reqPayload = req.query as { role: string };

      // find user
      const user = await this._store.findUserByStakeAddress(req.body.stakeAddress);
      const nonce = generateNonce("I agree to the term and condition of the Mesh: ");

      // handle if user doesnt exist
      if (!user) {
        // initiate new user
        const newUser = new User({
          stakeAddress: req.body.stakeAddress, // Use the actual stakeAddress from the request
          nonce: nonce,
          verified: false,
          roles: [reqPayload.role],
        });

        // insert to db
        const res = await newUser.save();

        if (res._id) {
          console.log("User successfully inserted with ID: ", res._id);
        } else {
          console.log("User insertion failed");
        }
      } else {
        // if user exists, just update the nonce
        user.nonce = nonce;

        // if user logged in as a seller but the seller role has not been set yet
        if (reqPayload.role === "seller") {
          await this._store.updateUser("roles", user.stakeAddress, ["seller"]);
        }

        // update user
        await this._store.updateUser("nonce", user.stakeAddress, nonce);
      }

      // console.log("Cookie set");
      return res.status(202).json({ message: "Login successful", nonce: nonce });
    } catch (error) {
      const err = new BadRequestError({ code: 500, message: `Something went wrong in login. ${error}` });
      next(err);
    }
  };
}
