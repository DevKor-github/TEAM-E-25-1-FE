import { useState } from "react";
import { api } from "@/lib/axios";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { Button } from "@/components/ui/button";

type OrgInfo = {
  name: string;
  contact: string;
};

type OrgInfoEditFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function OrgInfoEditForm({ onSuccess, onCancel }: OrgInfoEditFormProps) {
  const [formData, setFormData] = useState<OrgInfo>({
    name: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useOrgAuthStore((state) => state.accessToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.patch(
        "/organization",
        {
          name: formData.name,
          contact: formData.contact,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("기관 정보가 성공적으로 수정되었습니다!");
      onSuccess();
    } catch (err: any) {
      console.error("기관 정보 수정 실패:", err);
      setError(
        err.response?.data?.message ||
          "기관 정보 수정 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">기관 정보 수정</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기관명 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="기관명을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처 *
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "수정 중..." : "수정하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
