import './QuickInfoGrid.css';

export interface InfoField {
  label: string;
  value: string;
}

export function QuickInfoGrid({ fields }: { fields: InfoField[] }) {
  const visible = fields.filter((f) => f.value);
  if (visible.length === 0) return null;

  return (
    <div className="info-grid">
      {visible.map((f) => (
        <div className="info-cell" key={f.label}>
          <span className="info-cell-label">{f.label}</span>
          <span className="info-cell-value">{f.value}</span>
        </div>
      ))}
    </div>
  );
}
