"use client";

import { useMemo, useState } from "react";
import { Edit2, Plus, Star, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, Notice, Refreshing, TableSkeleton } from "@/components/Feedback";
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
import type { Protection, ProtectionInput } from "@/lib/api/types";
import { formatTimestamp, money } from "@/lib/format";
import { DEFAULT_BOND } from "@/lib/protection";
import { SearchBox } from "../components/ListControls";

type Form = {
  name: string;
  pricePerDay: string;
  isPopular: boolean;
  included: string; // one item per line
  excluded: string; // one item per line
  excessLabel: string;
  excessOver25: string;
  excessUnder25: string;
  bondCredit: string;
  bondDebit: string;
};

const empty: Form = {
  name: "",
  pricePerDay: "",
  isPopular: false,
  included: "",
  excluded: "",
  excessLabel: "Accident excess applicable",
  excessOver25: "",
  excessUnder25: "",
  bondCredit: String(DEFAULT_BOND.credit),
  bondDebit: String(DEFAULT_BOND.debit),
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

function fromProtection(p: Protection): Form {
  return {
    name: p.name ?? "",
    pricePerDay: p.pricePerDay == null ? "" : String(p.pricePerDay),
    isPopular: Boolean(p.isPopular),
    included: (p.included ?? []).join("\n"),
    excluded: (p.excluded ?? []).join("\n"),
    excessLabel: p.excessLabel ?? "",
    excessOver25: p.excessOver25 ?? "",
    excessUnder25: p.excessUnder25 ?? "",
    bondCredit: p.bondCredit == null ? "" : String(p.bondCredit),
    bondDebit: p.bondDebit == null ? "" : String(p.bondDebit),
  };
}

export default function ProtectionsPage() {
  // The backend returns every protection in one list (no paging), so searching happens here.
  const list = useAsync(async () => toList<Protection>((await adminApi.protections()).data), "protections");
  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Protection | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const t = term.trim().toLowerCase();
    return (list.data ?? []).filter((p) => !t || (p.name ?? "").toLowerCase().includes(t));
  }, [list.data, term]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setFormError(null);
    setOpen(true);
  };
  const openEdit = (p: Protection) => {
    setEditing(p);
    setForm(fromProtection(p));
    setFormError(null);
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const price = Number(form.pricePerDay);
    const bondCredit = Number(form.bondCredit);
    const bondDebit = Number(form.bondDebit);
    if (!name) return setFormError("Enter a name for the protection package.");
    if (!Number.isFinite(price) || price <= 0) return setFormError("Price per day must be greater than 0.");
    if (!Number.isFinite(bondCredit) || bondCredit < 0 || !Number.isFinite(bondDebit) || bondDebit < 0) return setFormError("Security bond amounts must be 0 or more.");
    if (!lines(form.included).length) return setFormError("List at least one thing this package covers.");

    const body: ProtectionInput = {
      name,
      pricePerDay: price,
      isPopular: form.isPopular,
      included: lines(form.included),
      excluded: lines(form.excluded),
      excessLabel: form.excessLabel.trim(),
      excessOver25: form.excessOver25.trim(),
      excessUnder25: form.excessUnder25.trim(),
      bondCredit,
      bondDebit,
    };
    void run(async () => {
      setFormError(null);
      try {
        if (editing) await adminApi.updateProtection(editing.id, body);
        else await adminApi.createProtection(body);
        setOpen(false);
        setFlash({ kind: "success", text: editing ? `“${name}” updated.` : `“${name}” added and offered to customers.` });
        list.reload();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not save the protection.");
      }
    });
  };

  const remove = (p: Protection) =>
    run(async () => {
      if (!(await confirm({ title: `Delete ${p.name}?`, description: "Customers will no longer be able to choose it. This cannot be undone.", confirmLabel: "Delete" }))) return;
      setFlash(null);
      try {
        await adminApi.deleteProtection(p.id);
        setFlash({ kind: "success", text: `“${p.name}” deleted.` });
        list.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not delete the protection." });
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protection</h1>
          <p className="mt-2 text-muted-foreground">
            Protection packages customers choose when booking, alongside the included Standard Cover. Changes apply to new bookings.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Add Protection
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <SearchBox value={term} onSearch={setTerm} placeholder="Search protection packages" />
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={list.refreshing} className="rounded-xl border bg-card">
        {list.loading && !list.refreshing ? (
          <TableSkeleton />
        ) : list.error ? (
          <div className="px-6">
            <ErrorState message={list.error} onRetry={list.reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Price / day</th>
                  <th className="px-6 py-4 font-medium">Covered / not covered</th>
                  <th className="px-6 py-4 font-medium">Excess (25+ / under 25)</th>
                  <th className="px-6 py-4 font-medium">Bond (credit / debit)</th>
                  <th className="px-6 py-4 font-medium">Updated</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        {p.name}
                        {p.isPopular && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            <Star className="size-3 fill-current" aria-hidden /> Popular
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">{money(p.pricePerDay)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {p.included?.length ?? 0} covered / {p.excluded?.length ?? 0} not
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                      {p.excessOver25 || "—"} / {p.excessUnder25 || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                      {money(p.bondCredit)} / {money(p.bondDebit)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{formatTimestamp(p.updatedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} disabled={busy} onClick={() => openEdit(p)}>
                          <Edit2 className="size-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} disabled={busy} onClick={() => remove(p)}>
                          <Trash2 className="size-4 text-destructive/70" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && <EmptyState>{term ? "No protection packages match your search." : "No protection packages yet. Add one to offer it to customers."}</EmptyState>}
          </div>
        )}
      </Refreshing>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Protection" : "Add Protection"}</DialogTitle>
            <DialogDescription>
              {editing ? "Changes apply to new bookings; existing bookings keep what they were charged." : "New packages are shown to customers on the booking page straight away."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="mt-4 space-y-4">
            {formError && <Notice>{formError}</Notice>}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prot-name">Name</Label>
                <Input id="prot-name" required value={form.name} onChange={set("name")} placeholder="e.g. Platinum Premium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prot-price">Price per day ($)</Label>
                <Input id="prot-price" type="number" min="0.01" step="0.01" required value={form.pricePerDay} onChange={set("pricePerDay")} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="prot-popular">Most popular</Label>
                <p className="text-xs text-muted-foreground">Shows a “Most popular” badge on this package.</p>
              </div>
              <Switch id="prot-popular" checked={form.isPopular} onCheckedChange={(v) => setForm((f) => ({ ...f, isPopular: v }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prot-included">Covered (one per line)</Label>
                <textarea
                  id="prot-included"
                  required
                  rows={8}
                  value={form.included}
                  onChange={set("included")}
                  placeholder={"Third Party\nPersonal Injury"}
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prot-excluded">Not covered (one per line)</Label>
                <textarea
                  id="prot-excluded"
                  rows={8}
                  value={form.excluded}
                  onChange={set("excluded")}
                  placeholder={"Key replacement\nLoss of Use"}
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="prot-excess-label">Excess heading</Label>
                <Input id="prot-excess-label" value={form.excessLabel} onChange={set("excessLabel")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prot-over25">Excess, ages 25+</Label>
                <Input id="prot-over25" value={form.excessOver25} onChange={set("excessOver25")} placeholder="$3,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prot-under25">Excess, under 25</Label>
                <Input id="prot-under25" value={form.excessUnder25} onChange={set("excessUnder25")} placeholder="$3,500 or N/A" />
              </div>
              <div className="hidden sm:block" />
              <div className="space-y-2">
                <Label htmlFor="prot-bond-credit">Bond: credit card ($)</Label>
                <Input id="prot-bond-credit" type="number" min="0" step="1" required value={form.bondCredit} onChange={set("bondCredit")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prot-bond-debit">Bond: debit card ($)</Label>
                <Input id="prot-bond-debit" type="number" min="0" step="1" required value={form.bondDebit} onChange={set("bondDebit")} />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" loading={busy}>{busy ? "Saving…" : editing ? "Save Changes" : "Add Protection"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
}
