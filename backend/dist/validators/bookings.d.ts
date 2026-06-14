import { z } from "zod";
export declare const createBookingSchema: z.ZodObject<{
    slotId: z.ZodString;
    guestName: z.ZodString;
    guestEmail: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    slotId: string;
    guestName: string;
    guestEmail: string;
    notes?: string | undefined;
}, {
    slotId: string;
    guestName: string;
    guestEmail: string;
    notes?: string | undefined;
}>;
