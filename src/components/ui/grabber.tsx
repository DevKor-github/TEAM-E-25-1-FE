const Grabber = ({ onClick }: { onClick?: () => void }) => (
  <div className="w-full min-h-[28px] px-[20px] py-[12px] gap-[10px] bg-white flex items-center justify-center">
    <div className="w-10 h-1 rounded-full bg-gray-200" onClick={onClick} />
  </div>
);

export default Grabber;
