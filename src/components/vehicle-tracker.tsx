"use client";

import { useState, useEffect } from 'react';
import type { Vehicle } from '../lib/types';
import VehicleForm from './vehicle-form';
import VehicleTable from './vehicle-table';
import EditVehicleModal from './edit-vehicle-modal';
import DeleteVehicleModal from './delete-vehicle-modal';
import { useToast } from "../hooks/use-toast";
import { exportToCsv, importFromCsv } from '../lib/csv-utils';
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

export default function VehicleTracker() {
  const [isMounted, setIsMounted] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedVehicles = localStorage.getItem('fleet-track-vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
    } catch (error) {
      console.error("Failed to load vehicles from local storage", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load data from local storage." });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('fleet-track-vehicles', JSON.stringify(vehicles));
      } catch (error) {
        console.error("Failed to save vehicles to local storage", error);
        toast({ variant: "destructive", title: "Error", description: "Could not save data to local storage." });
      }
    }
  }, [vehicles, isMounted, toast]);

  const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = { id: crypto.randomUUID(), ...newVehicleData };
    setVehicles(prev => [newVehicle, ...prev]);
    toast({ title: "Success", description: "Vehicle added successfully." });
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    setEditingVehicle(null);
    toast({ title: "Success", description: "Vehicle details updated." });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    setDeletingVehicle(null);
    toast({ title: "Success", description: "Vehicle entry deleted." });
  };
  
  const handleExport = () => {
    if (vehicles.length === 0) {
      toast({ variant: "destructive", title: "Export Failed", description: "There is no data to export." });
      return;
    }
    exportToCsv(vehicles, `fleet-data-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImport = async (file: File) => {
    try {
      const newVehiclesData = await importFromCsv(file);
      const newVehicles: Vehicle[] = newVehiclesData.map(v => ({ id: crypto.randomUUID(), ...v }));
      // Filter out duplicates based on vehicle number
      const uniqueNewVehicles = newVehicles.filter(nv => !vehicles.some(ev => ev.vehicle === nv.vehicle));
      setVehicles(prev => [...prev, ...uniqueNewVehicles]);
       toast({ title: "Success", description: `${uniqueNewVehicles.length} vehicles imported successfully.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: "Import Failed", description: errorMessage });
    }
  };

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 p-6 h-fit">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        </Card>
        <Card className="lg:col-span-2 p-6">
           <div className="mb-4 flex gap-4">
             <Skeleton className="h-12 flex-grow" />
             <Skeleton className="h-12 w-32" />
             <Skeleton className="h-12 w-32" />
           </div>
           <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <section className="xl:col-span-1">
        <VehicleForm onAddVehicle={handleAddVehicle} />
      </section>
      
      <section className="xl:col-span-2">
        <VehicleTable
          vehicles={vehicles}
          onEdit={setEditingVehicle}
          onDelete={setDeletingVehicle}
          onExport={handleExport}
          onImport={handleImport}
        />
      </section>

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          isOpen={!!editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={handleUpdateVehicle}
        />
      )}

      {deletingVehicle && (
        <DeleteVehicleModal
          vehicle={deletingVehicle}
          isOpen={!!deletingVehicle}
          onClose={() => setDeletingVehicle(null)}
          onConfirm={() => handleDeleteVehicle(deletingVehicle.id)}
        />
      )}
    </div>
  );
}
