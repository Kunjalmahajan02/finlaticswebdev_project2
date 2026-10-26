const tones = {
  green: "border-green-500/30 bg-green-500/5 text-green-400",
  red: "border-red-500/30 bg-red-500/5 text-red-400",
  blue: "border-sky-500/30 bg-sky-500/5 text-sky-400",
};

export default function FeedbackCard({ title, icon, items, tone = "blue" }) {
  return (
    <div className={`rounded-2xl border p-6 ${tones[tone]}`}>
      <h3 className="font-semibold mb-3">
        {icon} {title}
      </h3>
      <ul className="space-y-2 text-zinc-300 text-sm list-disc pl-5">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
