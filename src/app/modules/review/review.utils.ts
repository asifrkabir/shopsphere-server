import { Review } from "./review.model";

export const getExistingReviewById = async (id: string) => {
  const result = await Review.findOne({ _id: id, isActive: true });

  return result;
};
