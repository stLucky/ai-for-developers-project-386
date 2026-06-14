"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const index_1 = require("./index");
const OWNER_ID = "00000000-0000-0000-0000-000000000001";
const owner = {
    id: OWNER_ID,
    name: "Анна Смирнова",
    email: "anna@example.com",
    timezone: "Europe/Moscow",
    avatar: "https://i.pravatar.cc/150?u=anna",
};
const eventTypes = [
    {
        id: "00000000-0000-0000-0000-000000000002",
        ownerId: OWNER_ID,
        name: "Консультация 30 мин",
        description: "Индивидуальная консультация",
        durationMinutes: 30,
    },
    {
        id: "00000000-0000-0000-0000-000000000005",
        ownerId: OWNER_ID,
        name: "Встреча 1 час",
        description: "Командная встреча",
        durationMinutes: 60,
    },
];
function seed() {
    index_1.store.owner = owner;
    for (const et of eventTypes) {
        index_1.store.eventTypes.set(et.id, et);
    }
    console.log("[seed] Data seeded successfully");
}
//# sourceMappingURL=seed.js.map