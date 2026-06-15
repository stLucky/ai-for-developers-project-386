import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";
import { errorHandler } from "./middleware/errorHandler";
import { seed } from "./store/seed";
import { store } from "./store";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

seed();

app.use("/admin", adminRoutes);
app.use("/public", publicRoutes);

if (process.env.NODE_ENV === "test") {
  app.post("/__test/reset", (_req, res) => {
    store.eventTypes.clear();
    store.bookings.clear();
    seed();
    res.json({ message: "Store reset" });
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] Call Booking API running at http://localhost:${PORT}`);
});
