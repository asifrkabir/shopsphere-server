import { NewsletterSubscriber } from "./newsletter.model";

export const getExistingNewsletterSubscriptionById = async (id: string) => {
  const result = await NewsletterSubscriber.findOne({
    _id: id,
    isActive: true,
  });

  return result;
};

export const getExistingNewsletterSubscriptionByEmail = async (
  email: string
) => {
  const result = await NewsletterSubscriber.findOne({
    email,
    isActive: true,
  });

  return result;
};
