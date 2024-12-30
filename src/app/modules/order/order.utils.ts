import { Order } from "./order.model";

export const getExistingOrderById = async (id: string) => {
  const result = await Order.findOne({ _id: id, isActive: true });

  return result;
};
