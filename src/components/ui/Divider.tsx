export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div className="flex w-full p-1 gap-2.5">
      <div className={`w-full h-[1px] bg-gray-100 ${className}`} />
    </div>
  );
}
