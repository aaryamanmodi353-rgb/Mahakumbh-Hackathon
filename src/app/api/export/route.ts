import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, this would fetch data from a database
  const reportData = {
    timestamp: new Date().toISOString(),
    location: "Prayagraj Mahakumbh Area",
    metrics: {
      totalFootfall: "2.4M",
      activeVehicles: 14230,
      parkingCapacity: "85%",
      criticalAlerts: 3
    },
    alerts: [
      { type: "danger", message: "Stampede risk at Sangam Approach Road in 45 mins. Reroute advised." },
      { type: "warning", message: "Parking Lot B will reach capacity in 15 mins. Diverting to Lot C." },
      { type: "success", message: "Traffic flow normalized on Bridge 2." }
    ]
  };

  return NextResponse.json(reportData);
}
