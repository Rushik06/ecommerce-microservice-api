import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        //type issue solved
        id: req.params.id as string,
      },
      //added orderItems to include to get the order items along with order details
      include:{orderItems:true},
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export default getOrderById;
