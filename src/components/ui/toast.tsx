import ToastIcon from "../../assets/ToastIcon.svg";

interface ToastProps {
  message: string;
}

const Toast = ({ message }: ToastProps) => {
  return (
    <div className="flex flex-row w-fit h-fit max-w-[300px] rounded-[9999px] py-[10px] pl-[12px] pr-[16px] gap-[8px] bg-white">
      <img src={ToastIcon} width={24} height={24} alt="toast icon" />
      <div className="w-full h-fit font-medium text-body3 text-gray-700 font-pretendard">
        {message}
      </div>
    </div>
  );
};

export default Toast;
