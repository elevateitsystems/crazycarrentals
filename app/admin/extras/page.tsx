"use client";

import { useMemo, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, Notice, Refreshing, TableSkeleton } from "@/components/Feedback";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAsync } from "@/hooks/use-async";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { ExtraService } from "@/lib/api/types";
import { formatTimestamp, money } from "@/lib/format";
import { FilterSelect, SearchBox } from "../components/ListControls";

type Form = { name: string; pricePerDay: string; isActive: boolean };
const empty: Form = { name: "", pricePerDay: "", isActive: true };

const STATUSES = ["ACTIVE", "INACTIVE"] as const;

export default function ExtrasPage() {
  // The backend returns every extra in one list (no paging), so search and status filtering happen here.
  const extras = useAsync(async () => toList<ExtraService>((await adminApi.extras()).data), "extras");
  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExtraService | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const t = term.trim().toLowerCase();
    return (extras.data ?? []).filter(
      (e) => (!t || (e.name ?? "").toLowerCase().includes(t)) && (!status || (status === "ACTIVE") === (e.isActive !== false)),
    );
  }, [extras.data, term, status]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setFormError(null);
    setOpen(true);
  };
  const openEdit = (e: ExtraService) => {
    setEditing(e);
    setForm({ name: e.name ?? "", pricePerDay: e.pricePerDay == null ? "" : String(e.pricePerDay), isActive: e.isActive !== false });
    setFormError(null);
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const price = Number(form.pricePerDay);
    if (!name) return setFormError("Enter a name for the extra.");
    if (!Number.isFinite(price) || price <= 0) return setFormError("Price per day must be greater than 0.");
    void run(async () => {
      setFormError(null);
      try {
        if (editing) await adminApi.updateExtra(editing.id, { name, pricePerDay: price, isActive: form.isActive });
        else await adminApi.createExtra({ name, pricePerDay: price });
        setOpen(false);
        setFlash({ kind: "success", text: editing ? `“${name}” updated.` : `“${name}” added.` });
        extras.reload();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not save the extra.");
      }
    });
  };

  /** One-click activate / deactivate from the table. */
  const toggle = (x: ExtraService) =>
    run(async () => {
      const next = x.isActive === false;
      setTogglingId(x.id);
      setFlash(null);
      try {
        await adminApi.updateExtra(x.id, { isActive: next });
        setFlash({ kind: "success", text: `“${x.name}” is now ${next ? "active and offered to customers" : "inactive and hidden from customers"}.` });
        extras.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not change the status." });
      } finally {
        setTogglingId(null);
      }
    });

  const remove = (x: ExtraService) =>
    run(async () => {
      const used = x.bookingsCount ? ` It appears on ${x.bookingsCount} existing booking${x.bookingsCount === 1 ? "" : "s"}; consider deactivating it instead.` : "";
      if (!(await confirm({ title: `Delete ${x.name ?? "this extra"}?`, description: `This cannot be undone.${used}`, confirmLabel: "Delete" }))) return;
      setFlash(null);
      try {
        await adminApi.deleteExtra(x.id);
        setFlash({ kind: "success", text: `“${x.name}” deleted.` });
        extras.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not delete the extra." });
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Extras</h1>
          <p className="mt-2 text-muted-foreground">Optional add-ons customers can choose when booking. Inactive extras are hidden from customers.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Add Extra
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <SearchBox value={term} onSearch={setTerm} placeholder="Search extras" />
        <FilterSelect label="Status" value={status} options={STATUSES} allLabel="All statuses" onChange={setStatus} />
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={extras.refreshing} className="rounded-xl border bg-card">
        {extras.loading && !extras.refreshing ? (
          <TableSkeleton />
        ) : extras.error ? (
          <div className="px-6">
            <ErrorState message={extras.error} onRetry={extras.reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Price / day</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Bookings</th>
                  <th className="px-6 py-4 font-medium">Updated</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((x) => {
                  const active = x.isActive !== false;
                  return (
                    <tr key={x.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{x.name ?? "—"}</td>
                      <td className="px-6 py-4">{money(x.pricePerDay)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={active}
                            disabled={busy}
                            onCheckedChange={() => void toggle(x)}
                            aria-label={`${active ? "Deactivate" : "Activate"} ${x.name ?? "extra"}`}
                          />
                          <StatusBadge status={togglingId === x.id ? "pending" : active ? "active" : "inactive"} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{x.bookingsCount ?? "—"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{formatTimestamp(x.updatedAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Edit ${x.name ?? "extra"}`} disabled={busy} onClick={() => openEdit(x)}>
                            <Edit2 className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label={`Delete ${x.name ?? "extra"}`} disabled={busy} onClick={() => remove(x)}>
                            <Trash2 className="size-4 text-destructive/70" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!rows.length && (
              <EmptyState>{term || status ? "No extras match your filters." : "No extras yet. Add one to get started."}</EmptyState>
            )}
          </div>
        )}
      </Refreshing>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Extra" : "Add Extra"}</DialogTitle>
            <DialogDescription>
              {editing ? "Changes apply to new bookings; existing bookings keep what they were charged." : "New extras are active straight away and shown to customers."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="mt-4 space-y-4">
            {formError && <Notice>{formError}</Notice>}
            <div className="space-y-2">
              <Label htmlFor="extra-name">Name</Label>
              <Input id="extra-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Child Seat" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra-price">Price per day ($)</Label>
              <Input
                id="extra-price"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
              />
            </div>
            {editing && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="extra-active">Active</Label>
                  <p className="text-xs text-muted-foreground">Inactive extras are hidden when customers book.</p>
                </div>
                <Switch id="extra-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              </div>
            )}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" loading={busy}>{busy ? "Saving…" : editing ? "Save Changes" : "Add Extra"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
}
