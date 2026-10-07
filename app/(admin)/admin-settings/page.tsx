import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { adminSettings } from "@/lib/settings";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage fees, age requirements, and discount rates for the booking flow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Fees</CardTitle>
            <CardDescription>Configure extra charges for optional services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shuttleFee">Airport Shuttle Fee ($)</Label>
              <Input
                id="shuttleFee"
                type="number"
                defaultValue={adminSettings.shuttleFee}
                className="w-full"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discounts & Promotions</CardTitle>
            <CardDescription>Manage automated discounts during checkout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercent">"Pay Now" Discount (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                defaultValue={adminSettings.payNowDiscountPercent}
                className="w-full"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Driver Age Requirements</CardTitle>
            <CardDescription>Configure the allowed age brackets for drivers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Option 1</Label>
                <Input defaultValue={adminSettings.ageOptions[0]} />
              </div>
              <div className="space-y-2">
                <Label>Option 2</Label>
                <Input defaultValue={adminSettings.ageOptions[1]} />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
