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
import { Separator } from "./ui/separator";

type VehicleFormProps = {
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
};

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleForm({ onAddVehicle }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle: "",
      capacity: "",
      phone: "",
      owner: "",
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    try {
      await onAddVehicle(data);
      form.reset();
    } catch (error) {
      console.error("Failed to add vehicle", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-fit shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl">Add New Vehicle Entry</CardTitle>
      </CardHeader>
      <Separator className="mb-6"/>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
