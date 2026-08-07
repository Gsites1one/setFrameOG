// Coded UI mockups for the /work gallery (Iteration 8, Task 3).
//
// These are real components, not images and not icons: each one renders inside
// the same BrowserFrame the two website prototypes use, so a system panel and a
// website panel are the same object in the gallery. They are STATIC on purpose
// for now — no working inputs, no live calendar, no real data — but they are
// built to look like an actual screen rather than a diagram.
//
// Everything shown is invented demo content and is framed that way on the page
// by a "Prototype 0X" badge. Nothing here represents a real client, a real
// inbox, or a real result, and no number on any of these screens is presented
// as a measured outcome.
//
// Scale note: the screen area is aspect-video and renders around 480px wide on
// desktop, so type is deliberately tiny (7-10px). That is what makes it read as
// a real interface scaled down rather than an oversized cartoon of one.

const COPPER = "text-accent";

/* ── shared primitives, so nine mockups stay one visual family ───────────── */

function Shell({
  sidebar,
  children,
}: {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex bg-[#141416] text-foreground">
      {sidebar && (
        <div className="hidden w-[22%] shrink-0 flex-col gap-1.5 border-r border-white/[0.06] bg-black/20 p-2.5 sm:flex">
          {sidebar}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function TopBar({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-3 py-2">
      <span className="font-display text-[9px] font-semibold tracking-wide">
        {title}
      </span>
      {right}
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-[7px] ${
        active ? "bg-accent/15 text-accent" : "text-foreground/40"
      }`}
    >
      <span
        className={`h-1 w-1 rounded-full ${active ? "bg-accent" : "bg-foreground/25"}`}
      />
      {label}
    </div>
  );
}

function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "cool" | "good";
}) {
  const tones = {
    muted: "bg-white/[0.06] text-foreground/50",
    accent: "bg-accent/15 text-accent",
    cool: "bg-[#4fb3c9]/15 text-[#4fb3c9]",
    good: "bg-emerald-400/15 text-emerald-300/90",
  };
  return (
    <span className={`rounded-full px-1.5 py-[2px] text-[7px] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Avatar({ label }: { label: string }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[6px] font-semibold text-accent">
      {label}
    </span>
  );
}

function Line({ w = "100%", dim = false }: { w?: string; dim?: boolean }) {
  return (
    <span
      className={`block h-[3px] rounded-full ${dim ? "bg-white/[0.06]" : "bg-white/[0.12]"}`}
      style={{ width: w }}
    />
  );
}

/* ── 01 · response and booking ───────────────────────────────────────────── */

export function ResponseBookingMockup() {
  return (
    <Shell>
      <TopBar title="Inbox" right={<Pill tone="good">Auto-reply on</Pill>} />
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 p-3">
        <div className="flex gap-1.5">
          <Avatar label="JD" />
          <div className="max-w-[70%] rounded-lg rounded-tl-none bg-white/[0.06] px-2 py-1.5">
            <p className="text-[7.5px] leading-relaxed text-foreground/75">
              Hi — do you have any availability next week for a quote?
            </p>
            <span className="mt-1 block text-[6px] text-foreground/35">
              23:41
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-1.5">
          <div className="max-w-[74%] rounded-lg rounded-tr-none bg-accent/15 px-2 py-1.5 ring-1 ring-accent/20">
            <p className="text-[7.5px] leading-relaxed text-foreground/85">
              Thanks for getting in touch. Yes — here are the next open slots.
              Pick whichever suits and it is confirmed instantly.
            </p>
            <span className="mt-1 block text-[6px] text-accent/70">
              23:41 · replied in 4s
            </span>
          </div>
        </div>
        <div className="ml-auto flex w-[74%] gap-1">
          {["Tue 09:30", "Wed 14:00", "Thu 11:15"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 rounded border px-1 py-1 text-center text-[6.5px] ${
                i === 1
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-white/[0.08] text-foreground/45"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ── 02 · document processing ────────────────────────────────────────────── */

export function DocumentProcessingMockup() {
  const fields = [
    ["Supplier", "Norvik Supply BV"],
    ["Invoice no.", "INV-20418"],
    ["Amount", "€ 4,180.00"],
    ["Due", "14 days"],
  ];
  return (
    <Shell>
      <TopBar title="Document intake" right={<Pill tone="good">Filed</Pill>} />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-2.5">
        {/* the scanned document */}
        <div className="flex flex-col gap-1 rounded border border-white/[0.07] bg-white/[0.03] p-2">
          <Line w="55%" />
          <Line w="35%" dim />
          <div className="my-1 h-px w-full bg-white/[0.06]" />
          <Line w="90%" dim />
          <Line w="80%" dim />
          <Line w="86%" dim />
          <div className="mt-auto flex items-center justify-between">
            <Line w="40%" />
            <span className="text-[7px] font-semibold text-accent">
              € 4,180.00
            </span>
          </div>
        </div>
        {/* what was read out of it */}
        <div className="flex flex-col gap-1.5">
          {fields.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-1"
            >
              <span className="text-[6.5px] text-foreground/40">{k}</span>
              <span className="text-[7px] text-foreground/80">{v}</span>
            </div>
          ))}
          <div className="mt-auto flex items-center gap-1">
            <span className={`text-[7px] ${COPPER}`}>✓</span>
            <span className="text-[6.5px] text-foreground/45">
              Matched to purchase order
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ── 03 · lead capture ───────────────────────────────────────────────────── */

export function LeadCaptureMockup() {
  const rows = [
    ["MK", "M. Kowalski", "Quote request", "accent"],
    ["SB", "S. Brandt", "Newsletter", "muted"],
    ["AV", "A. Vermeer", "Callback", "cool"],
    ["TL", "T. Lang", "Quote request", "accent"],
  ] as const;
  return (
    <Shell
      sidebar={
        <>
          <NavItem label="All contacts" active />
          <NavItem label="This week" />
          <NavItem label="Sources" />
          <NavItem label="Export" />
        </>
      }
    >
      <TopBar title="Contacts" right={<Pill tone="accent">+12 today</Pill>} />
      <div className="flex min-h-0 flex-1 flex-col gap-1 p-2.5">
        {rows.map(([ini, name, src, tone]) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
          >
            <Avatar label={ini} />
            <span className="flex-1 text-[7.5px] text-foreground/80">
              {name}
            </span>
            <Pill tone={tone}>{src}</Pill>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ── 04 · outreach ───────────────────────────────────────────────────────── */

export function OutreachMockup() {
  const steps = [
    ["Step 1 · Intro", "100%"],
    ["Step 2 · Follow-up", "72%"],
    ["Step 3 · Last touch", "41%"],
  ];
  return (
    <Shell
      sidebar={
        <>
          <NavItem label="Campaigns" active />
          <NavItem label="Sequences" />
          <NavItem label="Replies" />
        </>
      }
    >
      <TopBar
        title="Outreach"
        right={<Pill tone="cool">Sending · 340 queued</Pill>}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
        {steps.map(([label, pct]) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[7px] text-foreground/60">{label}</span>
              <span className="text-[6.5px] text-foreground/40">{pct}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent"
                style={{ width: pct }}
              />
            </div>
          </div>
        ))}
        <div className="mt-auto flex items-center gap-1.5 rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
          <Avatar label="RB" />
          <span className="flex-1 truncate text-[7px] text-foreground/70">
            R. Bakker replied — “send details”
          </span>
          <Pill tone="good">Reply</Pill>
        </div>
      </div>
    </Shell>
  );
}

/* ── 05 · e-commerce ─────────────────────────────────────────────────────── */

export function EcommerceMockup() {
  const orders = [
    ["#1042", "02:14", "€ 89.00", "good"],
    ["#1041", "23:58", "€ 132.50", "good"],
    ["#1040", "22:07", "€ 45.00", "muted"],
  ] as const;
  return (
    <Shell>
      <TopBar title="Orders" right={<Pill tone="good">Store open</Pill>} />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 p-2.5">
        <div className="col-span-2 flex flex-col gap-1">
          {orders.map(([id, time, amt, tone]) => (
            <div
              key={id}
              className="flex items-center gap-2 rounded border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
            >
              <span className="text-[7px] text-foreground/70">{id}</span>
              <span className="text-[6.5px] text-foreground/35">{time}</span>
              <span className="ml-auto text-[7px] text-foreground/85">
                {amt}
              </span>
              <Pill tone={tone}>Paid</Pill>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-1 rounded border border-white/[0.06] bg-white/[0.02] p-2 text-center">
          <span className="text-[6.5px] text-foreground/40">Overnight</span>
          <span className="font-display text-[15px] font-bold leading-none text-accent">
            3
          </span>
          <span className="text-[6px] leading-tight text-foreground/35">
            orders while closed
          </span>
        </div>
      </div>
    </Shell>
  );
}

/* ── 06 · dashboards ─────────────────────────────────────────────────────── */

export function DashboardMockup() {
  const bars = [42, 58, 37, 71, 64, 88, 79];
  return (
    <Shell
      sidebar={
        <>
          <NavItem label="Overview" active />
          <NavItem label="Pipeline" />
          <NavItem label="Sources" />
        </>
      }
    >
      <TopBar title="Today" right={<Pill tone="cool">Live</Pill>} />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ["Enquiries", "18"],
            ["Booked", "7"],
            ["Open", "4"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-1"
            >
              <span className="block text-[6px] text-foreground/40">{k}</span>
              <span className="font-display text-[11px] font-bold leading-tight text-foreground/85">
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-end gap-1 rounded border border-white/[0.06] bg-white/[0.02] p-2">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === bars.length - 2 ? "bg-accent" : "bg-accent/35"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ── 07 · repetitive task automation (LLM skill-building) ────────────────── */

export function SkillsMockup() {
  const queue = [
    ["Sort inbound quotes", "done"],
    ["Draft reply from template", "done"],
    ["Tag by service type", "running"],
    ["File to project folder", "queued"],
  ] as const;
  return (
    <Shell>
      <TopBar title="Task runner" right={<Pill tone="cool">4 steps</Pill>} />
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2.5">
        {queue.map(([label, state]) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                state === "done"
                  ? "bg-emerald-400/70"
                  : state === "running"
                    ? "bg-accent"
                    : "bg-foreground/20"
              }`}
            />
            <span className="flex-1 text-[7.5px] text-foreground/75">
              {label}
            </span>
            <span className="text-[6px] text-foreground/35">
              {state === "done" ? "0.4s" : state === "running" ? "…" : "—"}
            </span>
          </div>
        ))}
        <div className="mt-auto text-[6.5px] text-foreground/35">
          Runs on every new message
        </div>
      </div>
    </Shell>
  );
}

/* ── 08 · automation hub ─────────────────────────────────────────────────── */

export function AutomationHubMockup() {
  return (
    <Shell>
      <TopBar title="Workflow" right={<Pill tone="good">Active</Pill>} />
      <div className="flex min-h-0 flex-1 items-center gap-1.5 p-3">
        {[
          ["Enquiry", "accent"],
          ["Reminder", "cool"],
          ["Hand-off", "accent"],
          ["Logged", "good"],
        ].map(([label, tone], i, arr) => (
          <div key={label} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded border border-white/[0.07] bg-white/[0.03] px-1 py-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  tone === "accent"
                    ? "bg-accent"
                    : tone === "cool"
                      ? "bg-[#4fb3c9]"
                      : "bg-emerald-400/70"
                }`}
              />
              <span className="truncate text-[6.5px] text-foreground/65">
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <span className="mx-0.5 shrink-0 text-[7px] text-accent/50">
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-1.5 text-[6.5px] text-foreground/35">
        Nothing waits on someone remembering
      </div>
    </Shell>
  );
}

/* ── 09 · system map ─────────────────────────────────────────────────────── */

export function SystemMapMockup() {
  const nodes = [
    { x: 18, y: 30, label: "Enquiry" },
    { x: 50, y: 18, label: "Reply" },
    { x: 50, y: 52, label: "Booking" },
    { x: 82, y: 30, label: "Invoice" },
    { x: 50, y: 82, label: "Follow-up" },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 4],
  ];
  return (
    <Shell>
      <TopBar title="System map" right={<Pill tone="accent">Documented</Pill>} />
      <div className="relative min-h-0 flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="rgba(199,123,63,0.35)"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {nodes.map((n) => (
          <div
            key={n.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded border border-accent/25 bg-[#141416] px-1.5 py-[3px] text-[6.5px] text-foreground/75"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            {n.label}
          </div>
        ))}
      </div>
    </Shell>
  );
}
