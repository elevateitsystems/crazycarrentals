import type { Car as ApiCar } from "@/lib/api/types";
import { carImage, carName, enumLabel } from "@/lib/format";
import type { Car } from "@/components/CarCard";

export function publicMileage(car: ApiCar) {
  if (car.unlimitedMileage === true) return "Unlimited Mileage";
  if (car.unlimitedMileage === false) return car.mileage ?? car.publicDetails?.mileage;
  return car.publicDetails?.mileage ?? car.mileage;
}

/** Maps a backend car onto the shape the card/booking UI renders. */
export function toCar(car: ApiCar): Car {
  const price = Number(car.pricePerDay ?? car.basePricePerDay);
  const basePrice = Number(car.basePricePerDay ?? car.pricePerDay);
  return {
    id: car.id,
    name: carName(car),
    category: enumLabel(car.carType) || "Vehicle",
    type: car.carType ?? "",
    image: carImage(car) ?? "",
    price: Number.isFinite(price) ? price : 0,
    basePrice: Number.isFinite(basePrice) ? basePrice : 0,
    seats: Number(car.totalSeat) || 0,
    doors: Number(car.doors) || 0,
    transmission: enumLabel(car.transmission) || "—",
    fuel: enumLabel(car.fuelType) || "—",
    soldOut: car.soldOut === true,
    payNowLabel: car.payNowLabel,
    details: car.publicDetails || publicMileage(car) != null ? { ...(car.publicDetails ?? {}), mileage: publicMileage(car) } : undefined,
  };
}
