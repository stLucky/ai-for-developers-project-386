"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const public_1 = __importDefault(require("./routes/public"));
const errorHandler_1 = require("./middleware/errorHandler");
const seed_1 = require("./store/seed");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, seed_1.seed)();
app.use("/admin", admin_1.default);
app.use("/public", public_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`[server] Call Booking API running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map