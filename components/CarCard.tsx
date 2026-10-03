import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type Car = {
  slug: string;
  name: string;
  category: string;
  type: string;
  image: string;
  price: number;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
};

export default function CarCard({ car }: { car: Car }) {
  const specs: [string, string | number][] = [
    ["Seats", car.seats],
    ["Doors", car.doors],
    ["Transmission", car.transmission],
    ["Fuel", car.fuel],
  ];

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-border bg-card py-0 shadow-sm">
      <div className="relative h-67.25 bg-muted">
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <CardContent className="px-5 py-4.25">
        <span className="block text-[11px] font-medium uppercase leading-4 tracking-[0.08em] text-muted-foreground">
          {car.category}
        </span>
        <CardTitle className="mt-1.5 text-[17px] font-semibold leading-6 text-card-foreground">
          {car.name}
        </CardTitle>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.25">
          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between text-[11px] leading-4">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-card-foreground">{value}</span>
            </div>
          ))}
        </div>

        <Separator className="mt-6 bg-border" />

        <div className="mt-4 flex items-baseline gap-1 leading-6">
          <span className="text-[11px] text-muted-foreground">From</span>
          <span className="text-[18px] font-bold text-card-foreground">${car.price}</span>
          <span className="text-[11px] text-muted-foreground">/day</span>
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            href={`/fleet/${car.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9.5 flex-1 rounded-[14px] border-border bg-card text-xs font-medium text-card-foreground shadow-none hover:bg-muted"
            )}
          >
            View Details
          </Link>
          <Link
            href={`/book?car=${car.slug}`}
            className={cn(
              buttonVariants(),
              "h-9.5 flex-1 rounded-[14px] bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            )}
          >
            Book Now
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}