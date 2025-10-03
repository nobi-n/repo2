import type { Vehicle } from './types';

export function exportToCsv(vehicles: Vehicle[], filename: string) {
  const headers = ['vehicle', 'capacity', 'owner', 'phone'];
  const csvRows = [
    headers.join(','),
    ...vehicles.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName as keyof Omit<Vehicle, 'id'>] ?? '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function importFromCsv(file: File): Promise<Omit<Vehicle, 'id'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        return reject(new Error("File is empty"));
      }
      try {
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['vehicle', 'capacity', 'owner', 'phone'];
        if (!requiredHeaders.every(h => headers.includes(h))) {
            return reject(new Error(`CSV must include headers: ${requiredHeaders.join(', ')}`));
        }

        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            if (requiredHeaders.includes(header)) {
                // @ts-ignore
                obj[header] = values[index]?.trim() ?? '';
            }
            return obj;
          }, {} as Omit<Vehicle, 'id'>);
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
