"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Edit2, Trash2, UploadCloud, UserRound, X } from "lucide-react";
import CarImage from "@/components/CarImage";
import { EmptyState, ErrorState, Notice, Refreshing, TableSkeleton } from "@/components/Feedback";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { Car, Driver } from "@/lib/api/types";
import { carFeatures, carImage, carName, enumLabel, listField, money } from "@/lib/format";
import { SearchBox, selectClass } from "../components/ListControls";

const PAGE_SIZE = 10;

type FormState = {
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  pricePerDay: string;
  totalSeat: string;
  doors: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  carType: string;
  description: string;
  features: string;
  safetyRatings: string;
};

const emptyForm: FormState = {
  brand: "", model: "", year: "", color: "", plate: "", pricePerDay: "", totalSeat: "", doors: "", mileage: "",
  fuelType: "", transmission: "", carType: "", description: "", features: "", safetyRatings: "",
};

// Values the backend accepts (checked against the live API). It answers anything else with a 500 instead of a
// validation error, so these are fixed choices rather than free text.
const OPTIONS = {
  carType: ["SEDAN", "HATCHBACK", "LUXURY", "ELECTRIC_CARS", "COMMERCIAL"],
  fuelType: ["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG"],
  transmission: ["AUTOMATIC", "MANUAL"],
} as const;

function fromCar(car: Car): FormState {
  const s = (v: unknown) => (v == null ? "" : String(v));
  return {
    brand: s(car.brand), model: s(car.model), year: s(car.year), color: s(car.color), plate: s(car.plate),
    pricePerDay: s(car.pricePerDay), totalSeat: s(car.totalSeat), doors: s(car.doors), mileage: s(car.mileage),
    fuelType: s(car.fuelType), transmission: s(car.transmission), carType: s(car.carType),
    description: s(car.description), features: carFeatures(car).join(", "), safetyRatings: listField(car.safetyRatings).join(", "),
  };
}

export default function FleetManagementPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const cars = useAsync(async () => {
    const res = await adminApi.cars({ page, limit: PAGE_SIZE, searchTerm });
    return { items: toList<Car>(res.data), meta: res.meta };
  }, JSON.stringify([page, searchTerm]));
  // All drivers, for the assignment picker and to name each car's driver (cars only carry `driverInfoId`).
  const drivers = useAsync(async () => toList<Driver>((await adminApi.drivers({ limit: 100 })).data), "drivers");
  const driverName = (id?: string | null) => (id ? drivers.data?.find((d) => d.id === id)?.name ?? "Assigned" : null);

  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  // add/edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // driver assignment dialog
  const [assigning, setAssigning] = useState<Car | null>(null);
  const [driverId, setDriverId] = useState("");
  const [assignError, setAssignError] = useState<string | null>(null);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFiles([]);
    setFormError(null);
    setFormOpen(true);
  };
  const openEdit = (car: Car) => {
    setEditing(car);
    setForm(fromCar(car));
    setFiles([]);
    setFormError(null);
    setFormOpen(true);
  };

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const body = new FormData();
      for (const [k, v] of Object.entries(form)) if (v !== "") body.append(k, v);
      files.forEach((f) => body.append("images", f));
      setFormError(null);
      try {
        if (editing) await adminApi.updateCar(editing.id, body);
        else await adminApi.createCar(body);
        setFormOpen(false);
        setFlash({ kind: "success", text: editing ? "Vehicle updated." : "Vehicle added." });
        if (!editing && page !== 1) setPage(1);
        else cars.reload();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not save the vehicle.");
      }
    });
  };

  const remove = (car: Car) =>
    run(async () => {
      if (!(await confirm({ title: `Delete ${carName(car)}?`, description: "This cannot be undone.", confirmLabel: "Delete" }))) return;
      try {
        await adminApi.deleteCar(car.id);
        setFlash({ kind: "success", text: "Vehicle deleted." });
        // step back a page if that was the last row on this one
        if (cars.data?.items.length === 1 && page > 1) setPage(page - 1);
        else cars.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not delete the vehicle." });
      }
    });

  const assign = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      if (!assigning) return;
      setAssignError(null);
      try {
        const res = await adminApi.assignDriver(assigning.id, driverId || null);
        setAssigning(null);
        setFlash({ kind: "success", text: res.message ?? (driverId ? "Driver assigned." : "Driver removed.") });
        cars.reload();
        drivers.reload();
      } catch (err) {
        setAssignError(err instanceof Error ? err.message : "Could not assign the driver.");
      }
    });
  };

  // Keep a car's current value selectable even if it isn't in the known list.
  const choices = (k: keyof typeof OPTIONS) => [...new Set([...OPTIONS[k], ...(form[k] ? [form[k]] : [])])];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="mt-2 text-muted-foreground">Manage your vehicles, pricing and assigned drivers.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <SearchBox
          value={searchTerm}
          onSearch={(term) => {
            setPage(1);
            setSearchTerm(term);
          }}
          placeholder="Search brand, model or plate"
        />
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={cars.refreshing} className="rounded-xl border bg-card">
        {cars.loading && !cars.refreshing ? (
          <TableSkeleton />
        ) : cars.error ? (
          <div className="px-6">
            <ErrorState message={cars.error} onRetry={cars.reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Plate</th>
                  <th className="px-6 py-4 font-medium">Price / Day</th>
                  <th className="px-6 py-4 font-medium">Driver</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cars.data?.items.map((car) => {
                  const img = carImage(car);
                  return (
                    <tr key={car.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {img && <CarImage src={img} alt={carName(car)} />}
                          </div>
                          <div className="flex flex-col">
                            <span>{carName(car)}{car.year ? ` (${car.year})` : ""}</span>
                            <span className="text-xs font-normal text-muted-foreground">
                              {[enumLabel(car.transmission), enumLabel(car.fuelType), car.totalSeat ? `${car.totalSeat} seats` : ""].filter(Boolean).join(" · ")}
                              {car.isAvailable === false && <span className="ml-1 text-destructive">· Unavailable</span>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{enumLabel(car.carType) || "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{car.plate ?? "—"}</td>
                      <td className="px-6 py-4 font-medium">{money(car.pricePerDay)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{driverName(car.driverInfoId) ?? "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Assign driver"
                            title="Assign driver"
                            onClick={() => {
                              setAssigning(car);
                              setDriverId(car.driverInfoId ?? "");
                              setAssignError(null);
                            }}
                          >
                            <UserRound className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Edit vehicle" onClick={() => openEdit(car)}>
                            <Edit2 className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="Delete vehicle" disabled={busy} onClick={() => remove(car)}>
                            <Trash2 className="size-4 text-destructive/70" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!cars.data?.items.length && <EmptyState>{searchTerm ? "No vehicles match your search." : "No vehicles found. Add one to get started."}</EmptyState>}
          </div>
        )}
      </Refreshing>
      <Pagination meta={cars.data?.meta} onPage={setPage} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the details of the selected vehicle." : "Fill out the form to add a new vehicle to your fleet."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={save} className="mt-4 space-y-5">
            {formError && <Notice>{formError}</Notice>}

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previews.map((src, i) => (
                  <div key={src} className="group relative aspect-video overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:bg-muted/50"
                >
                  <UploadCloud className="size-5" />
                  Add images
                </button>
              </div>
              {editing && <p className="text-xs text-muted-foreground">Choosing images uploads them with this update. Leave empty to keep the current ones.</p>}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  setFiles((fs) => [...fs, ...Array.from(e.target.files ?? [])]);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand" id="brand"><Input id="brand" required value={form.brand} onChange={set("brand")} placeholder="Toyota" /></Field>
              <Field label="Model" id="model"><Input id="model" required value={form.model} onChange={set("model")} placeholder="Camry" /></Field>
              <Field label="Year" id="year"><Input id="year" type="number" required value={form.year} onChange={set("year")} /></Field>
              <Field label="Color" id="color"><Input id="color" required value={form.color} onChange={set("color")} /></Field>
              <Field label="Plate" id="plate"><Input id="plate" required value={form.plate} onChange={set("plate")} /></Field>
              <Field label="Price per day ($)" id="pricePerDay"><Input id="pricePerDay" type="number" min="0" step="0.01" required value={form.pricePerDay} onChange={set("pricePerDay")} /></Field>
              <Field label="Seats" id="totalSeat"><Input id="totalSeat" type="number" min="1" required value={form.totalSeat} onChange={set("totalSeat")} /></Field>
              <Field label="Doors" id="doors"><Input id="doors" type="number" min="1" required value={form.doors} onChange={set("doors")} /></Field>
              <Field label="Mileage (km)" id="mileage"><Input id="mileage" type="number" min="0" required value={form.mileage} onChange={set("mileage")} /></Field>
              <Field label="Car type" id="carType">
                <select id="carType" required className={selectClass} value={form.carType} onChange={set("carType")}>
                  <option value="" disabled>Select…</option>
                  {choices("carType").map((v) => <option key={v} value={v}>{enumLabel(v)}</option>)}
                </select>
              </Field>
              <Field label="Fuel type" id="fuelType">
                <select id="fuelType" required className={selectClass} value={form.fuelType} onChange={set("fuelType")}>
                  <option value="" disabled>Select…</option>
                  {choices("fuelType").map((v) => <option key={v} value={v}>{enumLabel(v)}</option>)}
                </select>
              </Field>
              <Field label="Transmission" id="transmission">
                <select id="transmission" required className={selectClass} value={form.transmission} onChange={set("transmission")}>
                  <option value="" disabled>Select…</option>
                  {choices("transmission").map((v) => <option key={v} value={v}>{enumLabel(v)}</option>)}
                </select>
              </Field>
              <Field label="Safety ratings (comma separated)" id="safetyRatings"><Input id="safetyRatings" value={form.safetyRatings} onChange={set("safetyRatings")} placeholder="5-Star ANCAP" /></Field>
              <Field label="Features (comma separated)" id="features"><Input id="features" value={form.features} onChange={set("features")} placeholder="Bluetooth, Backup Camera" /></Field>
            </div>

            <Field label="Description" id="description">
              <textarea id="description" rows={3} required value={form.description} onChange={set("description")} className={`${selectClass} h-auto`} />
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" loading={busy}>{busy ? "Saving…" : editing ? "Save Changes" : "Add Vehicle"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assigning !== null} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign driver</DialogTitle>
            <DialogDescription>{assigning ? `Choose a driver for ${carName(assigning)}.` : ""}</DialogDescription>
          </DialogHeader>
          <form onSubmit={assign} className="mt-4 space-y-4">
            {assignError && <Notice>{assignError}</Notice>}
            {drivers.error && <Notice>{drivers.error}</Notice>}
            <select aria-label="Driver" className={selectClass} value={driverId} onChange={(e) => setDriverId(e.target.value)}>
              <option value="">{drivers.loading ? "Loading drivers…" : "No driver"}</option>
              {drivers.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name ?? d.email ?? d.id}
                  {d.licenseState || d.licenseNumber ? ` — ${[d.licenseState, d.licenseNumber].filter(Boolean).join(" ")}` : ""}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setAssigning(null)}>Cancel</Button>
              <Button type="submit" loading={busy} disabled={driverId === (assigning?.driverInfoId ?? "")}>
                {busy ? "Saving…" : driverId ? "Assign" : "Remove driver"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
