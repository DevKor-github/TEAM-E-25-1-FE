import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { Button } from "@/components/ui/button";
import Grabber from "@/components/ui/grabber";
import { useNavigate } from "react-router-dom";

interface OrgInfoSheetProps {
  open: boolean;
  onClose: () => void;
  onEditInfo: () => void;
  onChangePassword: () => void;
}

interface OrgInfo {
  name: string;
  contact: string;
}

export function OrgInfoSheet({ open, onClose, onEditInfo, onChangePassword }: OrgInfoSheetProps) {
  const [info, setInfo] = useState<OrgInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const logout = useOrgAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchOrgInfo();
    }
  }, [open]);

  const fetchOrgInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get("/organization");
      setInfo(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
       try {
         await api.delete("/auth/organization/withdraw");
         alert("회원 탈퇴가 완료되었습니다.");
         logout();
         delete api.defaults.headers.common["Authorization"];
         navigate("/org/login");
       } catch (err) {
         console.error(err);
         alert("회원 탈퇴 처리에 실패했습니다.");
       }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-6">
          <Grabber />
          <h2 className="text-lg font-bold mt-4">기관 정보 조회</h2>
        </div>

        {loading ? (
           <div className="text-center py-4">로딩 중...</div>
        ) : info ? (
          <div className="space-y-6 mb-8 px-2">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">기관명</label>
              <div className="font-medium text-lg">{info.name}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">연락처</label>
              <div className="font-medium text-lg">{info.contact}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">정보를 불러올 수 없습니다.</div>
        )}

        <div className="flex flex-col gap-3">
            <Button 
                variant="outline" 
                onClick={() => {
                    onClose();
                    onEditInfo();
                }} 
                className="w-full py-6 text-base"
            >
                기관 정보 수정
            </Button>
            <Button 
                variant="outline" 
                onClick={() => {
                    onClose();
                    onChangePassword();
                }} 
                className="w-full py-6 text-base"
            >
                비밀번호 변경
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full py-6 text-base">
                닫기
            </Button>
            <Button variant="link" onClick={handleWithdraw} className="w-full text-gray-400 text-sm h-auto p-0 mt-2">
                회원 탈퇴
            </Button>
        </div>
      </div>
    </div>
  );
}
