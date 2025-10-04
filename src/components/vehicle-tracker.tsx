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
import { db } from '../lib/firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';


export default function VehicleTracker() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Firebase Error",
        description: "Firebase is not configured. Please check your .env.local file and restart the server.",
      });
      setIsLoading(false);
      return;
    }

    const vehiclesRef = ref(db, 'vehicles');
    const unsubscribe = onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const vehiclesList: Vehicle[] = Object.entries(data).map(([id, vehicleData]) => ({
          id,
          ...(vehicleData as Omit<Vehicle, 'id'>),
        }));
        setVehicles(vehiclesList.reverse()); // Show newest first
      } else {
        setVehicles([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase read failed: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load data from the database." });
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);


  const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id'>) => {
    if (!db) return;
    const vehiclesRef = ref(db, 'vehicles');
    const newVehicleRef = push(vehiclesRef);
    set(newVehicleRef, newVehicleData)
      .then(() => {
        toast({ title: "Success", description: "Vehicle added successfully." });
      })
      .catch((error) => {
        console.error("Failed to add vehicle", error);
        toast({ variant: "destructive", title: "Error", description: "Could not add vehicle." });
      });
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    if (!db) return;
    const { id, ...vehicleData } = updatedVehicle;
    const vehicleRef = ref(db, `vehicles/${id}`);
    update(vehicleRef, vehicleData)
      .then(() => {
        setEditingVehicle(null);
        toast({ title: "Success", description: "Vehicle details updated." });
      })
      .catch((error) => {
        console.error("Failed to update vehicle", error);
        toast({ variant: "destructive", title: "Error", description: "Could not update vehicle." });
      });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (!db) return;
    const vehicleRef = ref(db, `vehicles/${vehicleId}`);
    remove(vehicleRef)
      .then(() => {
        setDeletingVehicle(null);
        toast({ title: "Success", description: "Vehicle entry deleted." });
      })
      .catch((error) => {
        console.error("Failed to delete vehicle", error);
        toast({ variant: "destructive", title: "Error", description: "Could not delete vehicle." });
      });
  };
  
  const handleExport = () => {
    if (vehicles.length === 0) {
      toast({ variant: "destructive", title: "Export Failed", description: "There is no data to export." });
      return;
    }
    exportToCsv(vehicles, `fleet-data-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImport = async (file: File) => {
    if (!db) return;
    try {
      const newVehiclesData = await importFromCsv(file);
      const vehiclesRef = ref(db, 'vehicles');
      const updates: { [key: string]: Omit<Vehicle, 'id'> } = {};
      let importCount = 0;

      newVehiclesData.forEach(v => {
        // Prevent duplicates based on vehicle number
        if (!vehicles.some(ev => ev.vehicle === v.vehicle)) {
          const newVehicleRef = push(vehiclesRef);
          if (newVehicleRef.key) {
            updates[newVehicleRef.key] = v;
            importCount++;
          }
        }
      });

      if (importCount > 0) {
        await update(ref(db, 'vehicles'), updates);
        toast({ title: "Success", description: `${importCount} vehicles imported successfully.` });
      } else {
        toast({ title: "Import Info", description: "No new vehicles to import." });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: "Import Failed", description: errorMessage });
    }
  };

  if (isLoading) {
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
