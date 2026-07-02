type AdminDataTableProps = {
  children: React.ReactNode;
  minWidthClassName?: string;
};

type AdminTableCellProps = {
  children: React.ReactNode;
  className?: string;
};

type AdminTdProps = AdminTableCellProps & {
  colSpan?: number;
};

export function AdminTableShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </section>
  );
}

export function AdminTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
      {children}
    </header>
  );
}

export function AdminDataTable({
  children,
  minWidthClassName = "min-w-[1050px]",
}: AdminDataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={["w-full text-left text-sm", minWidthClassName].join(" ")}
      >
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
      {children}
    </thead>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

export function AdminTh({ children, className = "" }: AdminTableCellProps) {
  return <th className={["px-6 py-4", className].join(" ")}>{children}</th>;
}

export function AdminTd({ children, className = "", colSpan }: AdminTdProps) {
  return (
    <td colSpan={colSpan} className={["px-6 py-4", className].join(" ")}>
      {children}
    </td>
  );
}

export function AdminTableEmpty({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan: number;
}) {
  return (
    <tr>
      <AdminTd
        colSpan={colSpan}
        className="py-10 text-center text-sm font-semibold text-slate-500"
      >
        {children}
      </AdminTd>
    </tr>
  );
}
