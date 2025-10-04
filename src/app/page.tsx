import VehicleTracker from "../components/vehicle-tracker";

export default function Home() {
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-8">
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
