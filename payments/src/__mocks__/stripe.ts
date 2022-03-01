export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "abcsdf" }),
  },
};

// append this file .ts.unused if you want to use the real Stripe API
