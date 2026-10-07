import type { StepProps } from "@/lib/booking";
import FormField from "./FormField";
import InfoNote from "./InfoNote";
import StepCard from "./StepCard";

export default function DetailsStep({ data, update, onNext, onBack }: StepProps) {
  return (
    <StepCard
      title="Your details"
      description="Enter your contact information for the booking confirmation."
      onSubmit={onNext}
      onBack={onBack}
    >
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            id="firstName"
            label="First name"
            placeholder="Sarah"
            required
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
          />
          <FormField
            id="lastName"
            label="Last name"
            placeholder="Mitchell"
            required
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
          />
        </div>
        <FormField
          id="email"
          label="Email address"
          type="email"
          placeholder="sarah@example.com"
          required
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
        />
        <FormField
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="04XX XXX XXX"
          required
          value={data.phone}
          onChange={(e) => update({ phone: e.target.value })}
        />

        <InfoNote>
          Your information is secure and will only be used to manage your booking. We do not share your data with
          third parties.
        </InfoNote>
      </div>
    </StepCard>
  );
}