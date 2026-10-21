"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AuthProvider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Modal,
  PageHeader,
  Spinner,
  fmtDate,
  inputClass,
  useToast,
} from "@/components/admin/ui";
import type { Role } from "@/types";

type User = {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  disabled: boolean;
  createdAt: string;
};

const ROLE_HELP: Record<Role, string> = {
  admin: "Full access, including team, adverts and settings.",
  editor: "Publish and edit any article, manage adverts and audience.",
  author: "Write drafts. An editor publishes them.",
};

export default function TeamPage() {
  const { api, me } = useAdmin();
  const toast = useToast();
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ displayName: "", email: "", password: "", role: "author" as Role });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setUsers((await api<{ users: User[] }>("/api/admin/users")).users);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the team.");
    }
  }, [api]);

  useEffect(() => {
    if (me?.role === "admin") void load();
  }, [load, me]);

  if (me && me.role !== "admin") {
    return (
      <>
        <PageHeader title="Team" />
        <ErrorBanner>Only admins can manage the team.</ErrorBanner>
      </>
    );
  }

  async function patch(u: User, body: Record<string, unknown>) {
    try {
      await api("/api/admin/users", { method: "PATCH", body: { uid: u.uid, ...body } });
      await load();
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not update.");
    }
  }

  async function remove(u: User) {
    if (!confirm(`Delete ${u.email}? They will lose access immediately.`)) return;
    try {
      await api(`/api/admin/users?uid=${encodeURIComponent(u.uid)}`, { method: "DELETE" });
      toast.ok("Member deleted.");
      await load();
    } catch (e) {
      toast.err(e instanceof Error ? e.message : "Could not delete.");
    }
  }

  async function add() {
    setFormError("");
    setSaving(true);
    try {
      await api("/api/admin/users", { method: "POST", body: form });
      toast.ok("Team member added.");
      setAdding(false);
      setForm({ displayName: "", email: "", password: "", role: "author" });
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not add.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Who can sign in to this admin, and what they can do."
        actions={
          <Button variant="red" onClick={() => setAdding(true)}>
            <i className="ti ti-user-plus" aria-hidden="true" /> Add member
          </Button>
        }
      />
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!users && !error && <Spinner label="Loading team…" />}

      {users && (
        <Card padded={false}>
          {users.length === 0 ? (
            <EmptyState icon="ti-users" title="No team members" />
          ) : (
            <ul>
              {users.map((u) => (
                <li key={u.uid} className="flex flex-wrap items-center gap-4 border-b border-border2 px-5 py-4 last:border-0">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-[14px] font-bold uppercase text-white">
                    {(u.displayName || u.email).charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold">
                      {u.displayName || u.email}{" "}
                      {u.uid === me?.uid && <Badge tone="black">you</Badge>}{" "}
                      {u.disabled && <Badge tone="red">disabled</Badge>}
                    </div>
                    <div className="truncate text-[12.5px] text-mid">
                      {u.email} · joined {fmtDate(u.createdAt)}
                    </div>
                  </div>
                  <select
                    value={u.role}
                    disabled={u.uid === me?.uid}
                    onChange={(e) => void patch(u, { role: e.target.value })}
                    aria-label={`Role for ${u.email}`}
                    className={`${inputClass} !w-auto !py-2 !text-[13px]`}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                  </select>
                  {u.uid !== me?.uid && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => void patch(u, { disabled: !u.disabled })}>
                        {u.disabled ? "Enable" : "Disable"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => void remove(u)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <Modal open={adding} title="Add team member" onClose={() => setAdding(false)}>
        <div className="space-y-4">
          {formError && <ErrorBanner>{formError}</ErrorBanner>}
          <Field label="Full name">
            <input className={inputClass} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Temporary password" hint="At least 8 characters. Share it with them securely.">
            <input type="text" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="off" />
          </Field>
          <Field label="Role" hint={ROLE_HELP[form.role]}>
            <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setAdding(false)}>Cancel</Button>
            <Button variant="red" disabled={saving} onClick={() => void add()}>
              {saving ? "Adding…" : "Add member"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
