import { z } from "zod";
export declare const createEventTypeSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    durationMinutes: number;
    description?: string | undefined;
}, {
    name: string;
    durationMinutes: number;
    description?: string | undefined;
}>;
export declare const updateEventTypeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    durationMinutes?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    durationMinutes?: number | undefined;
}>;
