import cors from "cors";

export const corsOptions = cors({
  origin: (_, callback) => {
    return callback(null, true);
  },
  credentials: true,
});
