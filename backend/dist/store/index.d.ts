import { Owner, EventType, Booking } from "../types";
export declare const store: {
    owner: Owner | null;
    eventTypes: Map<string, EventType>;
    bookings: Map<string, Booking>;
};
