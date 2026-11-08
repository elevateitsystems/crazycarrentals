import type { Car as ApiCar } from "@/lib/api/types";
import { carImage, carName, enumLabel } from "@/lib/format";
import type { Car } from "@/components/CarCard";

/** Maps a backend car onto the shape the card/booking UI renders. */
export function toCar(car: ApiCar): Car {
  const price = Number(car.pricePerDay);
  return {
    id: car.id,
    name: carName(car),
    category: enumLabel(car.carType) || "Vehicle",
    type: car.carType ?? "",
    image: carImage(car) ?? "",
    price: Number.isFinite(price) ? price : 0,
    seats: Number(car.totalSeat) || 0,
    doors: Number(car.doors) || 0,
    transmission: enumLabel(car.transmission) || "—",
    fuel: enumLabel(car.fuelType) || "—",
  };
}
