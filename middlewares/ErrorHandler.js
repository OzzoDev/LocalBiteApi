export const errorHandler = (err, req, res) => {
  res.status(500).json({ message: "Internal server error", success: false });
};
