import { Badge } from "../components/ui/badge";
import VehicleTracker from "../components/vehicle-tracker";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2 font-headline">
          Vehicle & Fleet Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Data management by Anandu.
        </p>
        <div className="flex justify-center mt-3">
          <Badge variant="outline" className="border-blue-300 bg-blue-100/80 text-blue-800">
            Local Data Storage Active
          </Badge>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <VehicleTracker />
      </main>
    </div>
  );
}
