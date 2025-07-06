import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import heartIcon from "../assets/heartIcon.svg";
import userIcon from "../assets/userIcon.svg";

interface HeaderFrameProps {
  onClickScrap?: () => void;
}

const HeaderFrame = ({ onClickScrap }: HeaderFrameProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[60px] flex flex-row items-center justify-between border-b border-b-gray-200 px-[20px]">
      <img src={logo} alt="univent logo" />
      <div className="flex flex-row items-center gap-4 w-fit h-fit min-w-[64px] min-h-[24px]">
        <img
          src={heartIcon}
          alt="scrap"
          className="cursor-pointer"
          onClick={onClickScrap}
        />
        <img
          src={userIcon}
          alt="user"
          className="cursor-pointer"
          onClick={() => navigate("/mypage")}
        />
      </div>
    </div>
  );
};

export default HeaderFrame;
