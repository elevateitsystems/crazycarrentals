import Link from "next/link";
import { Fuel, Landmark, CalendarX2 } from "lucide-react";

// Reminder copy supplied by the client for the review / summary stage (PDF "insurance package and extras").
const reminders = [
  {
    icon: Landmark,
    title: "Security Deposit",
    body: "A temporary pre-authorisation hold is required at pickup $200 if you using a credit card or $500 for debit card payment. This is automatically released within 5 business days of returning the vehicle, minus any active tolls, traffic fines, or fuel shortfalls.",
    note: "Note: Holds are strictly retained if the vehicle is returned with new damage.",
  },
  {
    icon: Fuel,
    title: "Fuel Policy",
    body: "Vehicles are provided with a full tank of fuel and must be returned completely full. If the vehicle is returned short of fuel, a $30.00 refuelling service fee will apply in addition to local pump prices for the missing fuel. You can also opt for our Pre-Purchased Fuel Option at checkout to return it empty!",
  },
  {
    icon: CalendarX2,
    title: "Cancellation Policy",
    body: "Enjoy total flexibility with Free Cancellation up to 24 hours before your scheduled pick-up time.",
    note: "Cancellations made within 24 hours of pick-up may incur a penalty or be issued as a credit voucher.",
  },
];

export default function PolicyReminders() {
  return (
    <section aria-labelledby="policy-reminders" className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
      <h3 id="policy-reminders" className="text-base font-semibold text-foreground">
        Before you proceed
      </h3>
      <ul className="mt-4 grid gap-5">
        {reminders.map(({ icon: Icon, title, body, note }) => (
          <li key={title} className="flex gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="text-sm leading-6 text-muted-foreground">
              <p className="font-semibold text-foreground">{title}</p>
              <p>{body}</p>
              {note && <p className="italic">{note}</p>}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">
        Full details are in our{" "}
        <Link href="/terms-and-conditions" target="_blank" rel="noopener" className="font-semibold text-foreground underline underline-offset-4">
          Terms and Conditions
        </Link>
        .
      </p>
    </section>
  );
}
