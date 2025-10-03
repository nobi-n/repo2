import { Badge } from "../components/ui/badge";
import VehicleTracker from "../components/vehicle-tracker";

export default function Home() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-lg">
            N
          </div>
          <span className="font-semibold text-lg">FleetTrack</span>
        </div>
        <Badge variant="outline" className="border-blue-300 bg-blue-100/80 text-blue-800">
          Local Data Storage Active
        </Badge>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2 font-headline">
            Vehicle & Fleet Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Data management by Anandu.
          </p>
        </div>
        <VehicleTracker />
      </main>
    </>
  );
}
