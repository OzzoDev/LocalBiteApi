export const getRestaurants = (_, res) => {
  res
    .status(200)
    .json({ restaurants: ["Taco bell", "McDonalds", "Pizz Hut", "KFC"], success: true });
};
