import { Badge } from "../components/ui/badge";
import VehicleTracker from "../components/vehicle-tracker";

export default function Home() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-end px-4 sm:px-8">
        <Badge variant="outline" className="border-blue-300 bg-blue-100/80 text-blue-800">
          Local Data Storage Active
        </Badge>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2 font-headline">
            Ashok Earth Movers
          </h1>
          <p className="text-lg text-muted-foreground">
            Vehicle & Fleet Tracker
          </p>
        </div>
        <VehicleTracker />
      </main>
    </>
  );
}
