import { z } from "zod";

export const vehicleSchema = z.object({
  vehicle: z.string().min(1, "Vehicle number is required.").transform(val => val.toUpperCase()),
  capacity: z.string().min(1, "Capacity is required."),
  owner: z.string().min(1, "Owner is required."),
  phone: z.string().min(10, "A valid 10-digit phone number is required.").max(10, "A valid 10-digit phone number is required.").regex(/^\d+$/, "Phone number must contain only digits."),
});
