import express, { NextFunction, Request, Response } from "express";
import UserStore from "../services/userStore";
import User, { UserDoc } from "../../db/models/user";
import { generateNonce } from "@meshsdk/core";

export class UserHandler {
  // attributes
  private store: UserStore;

  // constructor
  constructor(store: UserStore) {
    this.store = store;
  }

  // methods
  login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let error: Error | null = null;

    // handle request body
    try {
      // find user
      const user = await this.store.findUserByStakeAddress(req.body.stakeAddress);

      // handle if user doesnt exist
      if (!user) {
        // generate new nonce
        const nonce = generateNonce("I agree to the term and condition of the Mesh: ");

        // initiate new user
        const newUser = new User({
          stakeAddress: req.body.stakeAddress, // Use the actual stakeAddress from the request
          nonce: nonce,
          verified: false,
        });

        // insert to db
        try {
          await newUser.save();

          return res.status(201).json({ message: "user inserted to db" });
        } catch (err) {
          next(err);
        }
      }

      res.status(200).json({ message: "Login successful", user });
    } catch (err) {
      next(err);
    }
  };
}
