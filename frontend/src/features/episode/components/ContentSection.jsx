export default function ContentSection({ title, icon, children }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
      </div>
      <div>
        {children}
      </div>
    </section>
  );
}