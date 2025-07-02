import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import heartIcon from "../assets/heartIcon.svg";
import userIcon from "../assets/userIcon.svg";

const HeaderFrame = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[375px] h-[60px] flex flex-row items-center justify-between border-b border-b-gray-200 px-[20px] mx-auto">
      <img src={logo} alt="univent logo" />
      <div className="flex flex-row items-center gap-4 w-fit h-fit min-w-[64px] min-h-[24px]">
        <img src={heartIcon} alt="scrap" className="cursor-pointer" />
        <img
          src={userIcon}
          alt="user"
          className="cursor-pointer"
          onClick={() => navigate("/user")}
        />
      </div>
    </div>
  );
};

export default HeaderFrame;
