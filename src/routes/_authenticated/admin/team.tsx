import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listTeamMembers, upsertTeamMember, deleteTeamMember } from "@/lib/admin.functions";
import { AdminShell } from "@/components/admin-shell";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamPage,
});

type TeamMember = {
  id?: string;
  slug: string;
  name: string;
  role: string;
  department: string;
  location: string;
  bio: string;
  longBio: string;
  linkedin: string;
  email: string;
  experienceYears: number;
  skills: string[];
  experience: any[];
  education: any[];
  achievements: string[];
  videoUrl?: string;
  avatarInitials: string;
  avatarUrl?: string;
  accent: string;
};

function TeamPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listTeamMembers);
  const upsertFn = useServerFn(upsertTeamMember);
  const deleteFn = useServerFn(deleteTeamMember);

  const { data: members = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: () => listFn() as Promise<TeamMember[]>,
  });

  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Team member deleted");
      qc.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Team members">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Team members</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your team members and their profile pages.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3.5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Add member
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No team members yet — create your first one.</div>
        ) : (
          <ul className="divide-y divide-border">
            {members.map((m) => (
              <li key={m.slug} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} className="h-12 w-12 shrink-0 rounded-full border object-cover" /> : <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${m.accent || "from-indigo-500 to-cyan-500"} text-white font-bold`}>{m.avatarInitials || m.name.substring(0, 2).toUpperCase()}</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-brand-navy">{m.name}</p>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {m.department}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-brand-orange font-medium">{m.role}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.bio}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditing(m); setShowForm(true); }}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {m.id && (
                    <button
                      onClick={() => { if (confirm(`Delete "${m.name}"?`)) del.mutate(m.id!); }}
                      className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <TeamForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={async (payload) => {
            try {
              await upsertFn({ data: payload });
              toast.success("Team member saved");
              qc.invalidateQueries({ queryKey: ["team-members"] });
              setShowForm(false);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      )}
    </AdminShell>
  );
}

function TeamForm({
  initial,
  onClose,
  onSave,
}: {
  initial: TeamMember | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "Engineering");
  const [location, setLocation] = useState(initial?.location ?? "Hyderabad, India");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [longBio, setLongBio] = useState(initial?.longBio ?? "");
  const [linkedin, setLinkedin] = useState(initial?.linkedin ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [experienceYears, setExperienceYears] = useState(initial?.experienceYears ?? 0);
  const [avatarInitials, setAvatarInitials] = useState(initial?.avatarInitials ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [accent, setAccent] = useState(initial?.accent ?? "from-indigo-500 via-blue-500 to-cyan-500");
  const [saving, setSaving] = useState(false);

  // Auto-slugify
  function handleNameChange(val: string) {
    setName(val);
    if (!initial) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
      if (val.length > 0) {
        setAvatarInitials(val.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase());
      }
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      id: initial?.id,
      slug,
      name,
      role,
      department,
      location,
      bio,
      longBio,
      linkedin: linkedin || null,
      email: email || null,
      experienceYears: Number(experienceYears),
      avatarInitials,
      avatarUrl,
      accent,
      skills: initial?.skills ?? [],
      experience: initial?.experience ?? [],
      education: initial?.education ?? [],
      achievements: initial?.achievements ?? [],
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-brand-navy">{initial ? "Edit team member" : "Add team member"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input required value={name} onChange={(e) => handleNameChange(e.target.value)} className="input" />
            </Field>
            <Field label="Slug (URL key)" required>
              <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="input" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role / Title" required>
              <input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Full Stack Developer" className="input" />
            </Field>
            <Field label="Department" required>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input">
                <option value="Leadership">Leadership</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Cloud">Cloud</option>
                <option value="Creative">Creative</option>
                <option value="Business Development">Business Development</option>
                <option value="Performance Marketing">Performance Marketing</option>
                <option value="People & HR">People & HR</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Location" required>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
            </Field>
            <Field label="Experience (Years)">
              <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} className="input" />
            </Field>
            <Field label="Avatar Initials" required>
              <input required maxLength={3} value={avatarInitials} onChange={(e) => setAvatarInitials(e.target.value.toUpperCase())} className="input" />
            </Field>
          </div>
          <Field label="Short Bio" required>
            <input required value={bio} onChange={(e) => setBio(e.target.value)} placeholder="One-line summary for listing page" className="input" />
          </Field>
          <Field label="Team member photo">
            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} purpose="team" />
          </Field>
          <Field label="Detailed Bio" required>
            <textarea required rows={4} value={longBio} onChange={(e) => setLongBio(e.target.value)} className="input resize-none" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL"><input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" className="input" /></Field>
            <Field label="Work Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@100web.in" className="input" /></Field>
          </div>
          <Field label="Avatar Gradient Accent (Tailwind classes)" required>
            <input required value={accent} onChange={(e) => setAccent(e.target.value)} placeholder="from-indigo-500 via-blue-500 to-cyan-500" className="input" />
          </Field>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
      <style>{`.input{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:0.375rem;padding:0.5rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:transparent;box-shadow:0 0 0 2px oklch(0.72 0.17 55 / 0.4)}`}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">
        {label}{required && <span className="text-red-600"> *</span>}
      </label>
      {children}
    </div>
  );
}
