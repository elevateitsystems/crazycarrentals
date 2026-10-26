"use client";

import { useState } from "react";
import { Edit2, Search, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, Notice, Refreshing, TableSkeleton } from "@/components/Feedback";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { useAsync } from "@/hooks/use-async";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { User } from "@/lib/api/types";
import { useAdminAuth } from "@/lib/admin-auth";
import { enumLabel, formatDate, formatTimestamp } from "@/lib/format";
import { selectClass } from "../components/ListControls";

const PAGE_SIZE = 10;
const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;

const isLocked = (u: User) => Boolean(u.lockedUntil && new Date(u.lockedUntil) > new Date());

type Form = { name: string; role: string; phoneNumber: string; address: string; isEmailVerified: boolean; unlockAccount: boolean };

export default function CustomersPage() {
  const { user: me } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [term, setTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const users = useAsync(async () => {
    const res = await adminApi.users({ page, limit: PAGE_SIZE, role, searchTerm });
    return { items: toList<User>(res.data), meta: res.meta };
  }, JSON.stringify([page, role, searchTerm]));

  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Form>({ name: "", role: "USER", phoneNumber: "", address: "", isEmailVerified: false, unlockAccount: false });
  const [formError, setFormError] = useState<string | null>(null);
  // Full record (bookings count, address, lock state) for the user being edited.
  const detail = useAsync(async () => (editing ? (await adminApi.user(editing.id)).data : null), editing?.id ?? "");

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      name: u.name ?? "",
      role: u.role ?? "USER",
      phoneNumber: u.phoneNumber ?? "",
      address: u.address ?? "",
      isEmailVerified: Boolean(u.isEmailVerified),
      unlockAccount: false,
    });
    setFormError(null);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      if (!editing) return;
      if (form.role !== (editing.role ?? "USER")) {
        const ok = await confirm({
          title: `Change role to ${enumLabel(form.role)}?`,
          description: form.role === "USER" ? "They will lose access to the admin dashboard." : "They will get access to the admin dashboard and all customer data.",
          confirmLabel: "Change role",
          destructive: form.role === "USER",
        });
        if (!ok) return;
      }
      setFormError(null);
      try {
        await adminApi.updateUser(editing.id, { ...form });
        setEditing(null);
        setFlash({ kind: "success", text: "User updated." });
        users.reload();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not update the user.");
      }
    });
  };

  const remove = (u: User) =>
    run(async () => {
      if (!(await confirm({ title: `Delete ${u.name ?? u.email ?? "this user"}?`, description: "This permanently deletes the account and cannot be undone.", confirmLabel: "Delete" }))) return;
      try {
        await adminApi.deleteUser(u.id);
        setFlash({ kind: "success", text: "User deleted." });
        if (users.data?.items.length === 1 && page > 1) setPage(page - 1);
        else users.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not delete the user." });
      }
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="mt-2 text-muted-foreground">Manage customer accounts, roles and access.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearchTerm(term.trim());
        }}
        className="flex flex-wrap gap-2"
      >
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by name or email" className="pl-9" />
        </div>
        <select
          aria-label="Filter by role"
          className={`${selectClass} w-40`}
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{enumLabel(r)}</option>)}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      <Refreshing active={users.refreshing} className="rounded-xl border bg-card">
        {users.loading && !users.refreshing ? (
          <TableSkeleton />
        ) : users.error ? (
          <div className="px-6">
            <ErrorState message={users.error} onRetry={users.reload} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Account</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.data?.items.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                          {(u.name ?? u.email ?? "?").charAt(0)}
                        </div>
                        <span className="font-medium">{u.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{u.email ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">{u.phoneNumber ?? ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={u.role} /></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-muted-foreground">
                        <span>{u.isEmailVerified ? "Email verified" : "Email unverified"}</span>
                        {isLocked(u) ? (
                          <span className="text-xs font-medium text-destructive">Locked until {formatTimestamp(u.lockedUntil)}</span>
                        ) : (
                          <span className="text-xs">Joined {formatDate(u.createdAt)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit user" onClick={() => openEdit(u)}>
                          <Edit2 className="size-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete user"
                          disabled={busy || u.id === me?.id}
                          title={u.id === me?.id ? "You cannot delete your own account" : undefined}
                          onClick={() => remove(u)}
                        >
                          <Trash2 className="size-4 text-destructive/70" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.data?.items.length && <EmptyState>No customers found.</EmptyState>}
          </div>
        )}
      </Refreshing>
      <Pagination meta={users.data?.meta} onPage={setPage} />

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              {editing?.email}
              {detail.data && (
                <span className="mt-1 block text-xs">
                  {detail.data._count?.bookings ?? 0} booking{detail.data._count?.bookings === 1 ? "" : "s"} · Last login {formatTimestamp(detail.data.lastLoginAt)}
                  {isLocked(detail.data) && ` · Locked after ${detail.data.loginAttempts ?? "several"} failed attempts`}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="mt-4 space-y-4">
            {formError && <Notice>{formError}</Notice>}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className={selectClass}
                value={form.role}
                disabled={editing?.id === me?.id}
                title={editing?.id === me?.id ? "You cannot change your own role" : undefined}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => <option key={r} value={r}>{enumLabel(r)}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="verified">Email verified</Label>
              <Switch id="verified" checked={form.isEmailVerified} onCheckedChange={(v) => setForm({ ...form, isEmailVerified: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="unlock">Unlock account</Label>
              <Switch id="unlock" checked={form.unlockAccount} onCheckedChange={(v) => setForm({ ...form, unlockAccount: v })} />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" loading={busy}>{busy ? "Saving…" : "Save Changes"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
}
