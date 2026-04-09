import { Request, Response, NextFunction } from "express";
import redis from "@/redis";
import axios from "axios";

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartSessionId = req.headers?.["x-cart-session-id"] as string;
    
    if (!cartSessionId) {
      console.log("No cart session id found");
      res
        .status(400)
        .json({ error: "Missing x-cart-session-id header", data: [] });
      return;
    }

    const session = await redis.exists(`sessions:${cartSessionId}`);

    if (!session) {
      console.log("Cart session not found or already expired");
      return res.status(404).json({ error: "Session not found", data: [] });
    }

    await Promise.all([
      redis.del(`sessions:${cartSessionId}`),
      redis.del(`carts:${cartSessionId}`),
    ]);

    console.log(`Cart and Session cleared for: ${cartSessionId}`);

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default clearCart;
