import logo from "../assets/logo.svg";
import heartIcon from "../assets/heartIcon.svg";
import userIcon from "../assets/userIcon.svg";

const HeaderFrame = () => {
  return (
    <div className="w-[375px] h-[60px] flex flex-row items-center justify-between border-b border-b-gray-200 px-[20px]">
      <img src={logo} alt="univent logo" />
      <div className="flex flex-row items-center gap-4 w-fit h-fit min-w-[64px] min-h-[24px]">
        <img src={heartIcon} alt="scrap" />
        <img src={userIcon} alt="user" />
      </div>
    </div>
  );
};

export default HeaderFrame;
