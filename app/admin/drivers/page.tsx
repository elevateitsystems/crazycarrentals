"use client";

import { useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
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
import type { Driver } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { SearchBox } from "../components/ListControls";

const PAGE_SIZE = 10;

type Form = {
  name: string; phoneNumber: string; email: string; dateOfBirth: string; age: string;
  licenseState: string; licenseNumber: string; licenseExpiry: string;
};
const empty: Form = { name: "", phoneNumber: "", email: "", dateOfBirth: "", age: "", licenseState: "", licenseNumber: "", licenseExpiry: "" };

const toInputDate = (v?: string) => (v ? v.slice(0, 10) : "");

export default function DriversPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const drivers = useAsync(async () => {
    const res = await adminApi.drivers({ page, limit: PAGE_SIZE, searchTerm });
    return { items: toList<Driver>(res.data), meta: res.meta };
  }, JSON.stringify([page, searchTerm]));
  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setFormError(null);
    setOpen(true);
  };
  const openEdit = (d: Driver) => {
    setEditing(d);
    setForm({
      name: d.name ?? "", phoneNumber: d.phoneNumber ?? "", email: d.email ?? "",
      dateOfBirth: toInputDate(d.dateOfBirth), age: d.age == null ? "" : String(d.age), licenseState: d.licenseState ?? "",
      licenseNumber: d.licenseNumber ?? "", licenseExpiry: toInputDate(d.licenseExpiry),
    });
    setFormError(null);
    setOpen(true);
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      setFormError(null);
      try {
        if (editing) await adminApi.updateDriver(editing.id, { ...form });
        else await adminApi.createDriver({ ...form });
        setOpen(false);
        setFlash({ kind: "success", text: editing ? "Driver updated." : "Driver added." });
        if (!editing && page !== 1) setPage(1);
        else drivers.reload();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not save the driver.");
      }
    });
  };

  const remove = (d: Driver) =>
    run(async () => {
      const assigned = d.cars?.length ? ` They are assigned to ${d.cars.map((c) => [c.brand, c.model].filter(Boolean).join(" ")).join(", ")}.` : "";
      if (!(await confirm({ title: `Delete ${d.name ?? "this driver"}?`, description: `This cannot be undone.${assigned}`, confirmLabel: "Delete" }))) return;
      try {
        await adminApi.deleteDriver(d.id);
        setFlash({ kind: "success", text: "Driver deleted." });
        if (drivers.data?.items.length === 1 && page > 1) setPage(page - 1);
        else drivers.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not delete the driver." });
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="mt-2 text-muted-foreground">Drivers that can be assigned to vehicles in Fleet Management.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Add Driver
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <SearchBox
          value={searchTerm}
          onSearch={(term) => {
            setPage(1);
            setSearchTerm(term);
          }}
          placeholder="Search name, email or licence"
        />
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={drivers.refreshing} className="rounded-xl border bg-card">
        {drivers.loading && !drivers.refreshing ? (
          <TableSkeleton />
        ) : drivers.error ? (
          <div className="px-6">
            <ErrorState message={drivers.error} onRetry={drivers.reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Age</th>
                  <th className="px-6 py-4 font-medium">Licence</th>
                  <th className="px-6 py-4 font-medium">Vehicles</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drivers.data?.items.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{d.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{d.email ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">{d.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{d.age ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{[d.licenseState, d.licenseNumber].filter(Boolean).join(" · ") || "—"}</span>
                        <span className={`text-xs ${d.licenseExpiry && new Date(d.licenseExpiry) < new Date() ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                          {d.licenseExpiry && new Date(d.licenseExpiry) < new Date() ? "Expired" : "Expires"} {formatDate(d.licenseExpiry)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{d.cars?.length ? d.cars.map((c) => [c.brand, c.model].filter(Boolean).join(" ")).join(", ") : "—"}</span>
                        {typeof d.bookingsCount === "number" && (
                          <span className="text-xs text-muted-foreground">{d.bookingsCount} booking{d.bookingsCount === 1 ? "" : "s"}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit driver" onClick={() => openEdit(d)}>
                          <Edit2 className="size-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete driver" disabled={busy} onClick={() => remove(d)}>
                          <Trash2 className="size-4 text-destructive/70" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!drivers.data?.items.length && <EmptyState>{searchTerm ? "No drivers match your search." : "No drivers yet. Add one to get started."}</EmptyState>}
          </div>
        )}
      </Refreshing>
      <Pagination meta={drivers.data?.meta} onPage={setPage} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Driver" : "Add Driver"}</DialogTitle>
            <DialogDescription>Licence details are stored with the driver record.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="mt-4 space-y-4">
            {formError && <Notice>{formError}</Notice>}
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Full name" id="name"><Input id="name" required value={form.name} onChange={set("name")} /></F>
              <F label="Phone number" id="phone"><Input id="phone" type="tel" required value={form.phoneNumber} onChange={set("phoneNumber")} /></F>
              <F label="Email" id="email"><Input id="email" type="email" required value={form.email} onChange={set("email")} /></F>
              <F label="Date of birth" id="dob"><Input id="dob" type="date" required value={form.dateOfBirth} onChange={set("dateOfBirth")} /></F>
              <F label="Age (e.g. 25 or 25+)" id="age"><Input id="age" required pattern="\d{2}\+?" title="A number such as 25, optionally followed by +" value={form.age} onChange={set("age")} placeholder="25+" /></F>
              <F label="Licence state" id="state"><Input id="state" required value={form.licenseState} onChange={set("licenseState")} placeholder="QLD" /></F>
              <F label="Licence number" id="number"><Input id="number" required value={form.licenseNumber} onChange={set("licenseNumber")} /></F>
              <F label="Licence expiry" id="expiry"><Input id="expiry" type="date" required value={form.licenseExpiry} onChange={set("licenseExpiry")} /></F>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" loading={busy}>{busy ? "Saving…" : editing ? "Save Changes" : "Add Driver"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
}

function F({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
