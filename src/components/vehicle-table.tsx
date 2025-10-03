"use client";

import { useState, useMemo, useRef } from "react";
import type { Vehicle } from "../lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, FileUp, FileDown, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

type VehicleTableProps = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onExport: () => void;
  onImport: (file: File) => void;
};

export default function VehicleTable({ vehicles, onEdit, onDelete, onExport, onImport }: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v =>
      (v.vehicle?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (v.capacity?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (v.owner?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (v.phone?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    event.target.value = ''; // Reset file input
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vehicles..."
              className="w-full sm:w-64 pl-10 pr-4 py-3 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0 flex items-center space-x-3 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button onClick={handleImportClick} variant="outline" className="h-12 text-base flex-grow sm:flex-grow-0">
              <FileUp className="mr-2 h-5 w-5" /> Import
            </Button>
            <Button onClick={onExport} className="h-12 text-base flex-grow sm:flex-grow-0">
              <FileDown className="mr-2 h-5 w-5" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.vehicle}</TableCell>
                    <TableCell>{v.capacity}</TableCell>
                    <TableCell>{v.owner}</TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(v)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(v)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    {vehicles.length === 0 ? "No vehicles added yet." : "No results found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
