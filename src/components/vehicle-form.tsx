"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vehicleSchema } from "../lib/schemas";
import type { Vehicle } from "../lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

type VehicleFormProps = {
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
};

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleForm({ onAddVehicle }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle: "",
      capacity: "",
      owner: "",
      phone: "",
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    setIsSubmitting(true);
    setFormMessage("");
    try {
      onAddVehicle(data);
      form.reset();
      setFormMessage("Vehicle added successfully!");
      setTimeout(() => setFormMessage(""), 3000);
    } catch (error) {
      setFormMessage("Failed to add vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="border-b pb-3">Add New Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <Input placeholder="Vehicle Number" {...field} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); field.onChange(e); }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1000 kg / 20m³" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Anandu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., 7356986515" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
            {formMessage && <p className="mt-3 text-sm text-center text-primary">{formMessage}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
