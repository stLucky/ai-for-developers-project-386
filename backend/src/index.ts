import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";
import { errorHandler } from "./middleware/errorHandler";
import { seed } from "./store/seed";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

seed();

app.use("/admin", adminRoutes);
app.use("/public", publicRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] Call Booking API running at http://localhost:${PORT}`);
});
