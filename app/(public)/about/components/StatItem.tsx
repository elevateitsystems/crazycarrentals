type Props = {
  value: string;
  label: string;
  caption: string;
};

export default function StatItem({ value, label, caption }: Props) {
  return (
    <div className="border-white/10 px-6 py-9 text-center max-lg:nth-[-n+2]:border-b max-lg:odd:border-r sm:py-11 lg:border-r lg:last:border-r-0">
      <dd className="text-4xl font-bold leading-none tracking-tight text-primary sm:text-5xl">{value}</dd>
      <dt className="mt-4 text-sm font-semibold text-white">{label}</dt>
      <p className="mt-1 text-xs text-white/50">{caption}</p>
    </div>
  );
}
