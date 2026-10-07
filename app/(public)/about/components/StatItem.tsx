type Props = {
  value: string;
  label: string;
  caption: string;
};

export default function StatItem({ value, label, caption }: Props) {
  return (
    <div className="border-background/10 px-6 py-10 text-center max-lg:nth-[-n+2]:border-b max-lg:odd:border-r lg:border-r lg:last:border-r-0">
      <p className="text-4xl font-bold leading-10 tracking-tight text-primary">{value}</p>
      <p className="mt-3 text-sm font-semibold text-background">{label}</p>
      <p className="mt-1 text-xs text-background/40">{caption}</p>
    </div>
  );
}