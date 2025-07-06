export default function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-[1px] w-[327px] bg-gray-100 ${className}`} />;
}
