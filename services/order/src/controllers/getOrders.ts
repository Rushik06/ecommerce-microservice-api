import { Request, Response, NextFunction } from "express";

import prisma from "@/prisma";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {

    //remove the where condition to get all orders instead of only completed orders
    //before const orders = await prisma.order.findMany({where:{status:"COMPLETED"}})

    //now it will return all orders regardless of their status
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export default getOrders;
