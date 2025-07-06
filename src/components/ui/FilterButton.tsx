import listFilterIcon from "../../assets/list-filter.svg";
import rotateCwIcon from "../../assets/rotate-cw.svg";

interface FilterButtonProps {
  label: "필터" | "초기화";
  onClick?: () => void;
  className?: string;
}

export default function FilterButton({
  label,
  onClick,
  className = "",
}: FilterButtonProps) {
  const icon =
    label === "필터" ? (
      <img src={listFilterIcon} alt="필터" className="w-6 h-6" />
    ) : (
      <img src={rotateCwIcon} alt="초기화" className="w-6 h-6" />
    );

  return (
    <button
      type="button"
      className={`inline-flex items-center px-2 py-1 gap-1 rounded-[8px] bg-white text-[17px] font-medium text-gray-500 font-pretendard hover:bg-gray-100 transition ${className}`}
      onClick={onClick}
    >
      {icon}
      <span
        style={{
          fontFamily: "Pretendard",
          fontWeight: 500,
          fontSize: 17,
          color: "var(--Grays-Gray-500, #6A7282)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
