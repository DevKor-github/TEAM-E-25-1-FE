import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

type SignupFormData = {
  username: string;
  password: string;
  passwordConfirm: string;
  organizationName: string;
  phoneNumber: string;
};

type OrgSignupFormProps = {
  onSubmit: (data: SignupFormData) => void;
};

export function OrgSignupForm({ onSubmit }: OrgSignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    passwordConfirm: "",
    organizationName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  // 아이디 유효성 검사 (4~20자, 영문소문자/숫자/언더바만)
  const validateUsername = (username: string): string | null => {
    if (username.length < 4 || username.length > 20) {
      return "아이디는 4~20자여야 합니다.";
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return "아이디는 영문 소문자, 숫자, 언더바(_)만 사용 가능합니다.";
    }
    return null;
  };

  // 비밀번호 유효성 검사 (10~30자, 영문/숫자 필수)
  const validatePassword = (password: string): string | null => {
    if (password.length < 10 || password.length > 30) {
      return "비밀번호는 10자 이상 30자 이하여야 합니다.";
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "비밀번호는 영문과 숫자를 모두 포함해야 합니다.";
    }
    return null;
  };

  // 연락처 유효성 검사 (010-xxxx-xxxx)
  const validatePhoneNumber = (phone: string): string | null => {
    if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      return "연락처는 010-xxxx-xxxx 형식이어야 합니다.";
    }
    return null;
  };

  // 아이디 중복 체크
  const handleCheckUsername = async () => {
    const error = validateUsername(formData.username);
    if (error) {
      setErrors({ ...errors, username: error });
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await api.post(`/auth/organization/check-account-id`, {
        accountId: formData.username,
      });
      
      // isDuplicated: true = 아이디 중복, false = 사용 가능
      const { isDuplicated } = response.data;
      
      if (isDuplicated) {
        // 중복 아이디
        setIsUsernameAvailable(false);
        setIsUsernameChecked(true);
        setErrors({ ...errors, username: "이미 사용 중인 아이디입니다." });
      } else {
        // 사용 가능
        setIsUsernameAvailable(true);
        setIsUsernameChecked(true);
        setErrors({ ...errors, username: undefined });
      }
    } catch (err: any) {
      console.error("아이디 중복 체크 에러:", err);
      setErrors({ ...errors, username: "아이디 중복 확인에 실패했습니다." });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // 아이디 변경 시 중복 체크 초기화
    if (field === "username") {
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
    }
    
    // 실시간 에러 제거
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    // 아이디 중복 체크 확인
    if (!isUsernameChecked || !isUsernameAvailable) {
      newErrors.username = "아이디 중복 확인을 해주세요.";
    }

    // 비밀번호 검증
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 단체 이름 검증
    if (formData.organizationName.trim().length === 0) {
      newErrors.organizationName = "단체 이름을 입력해주세요.";
    }

    // 연락처 검증
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 아이디 */}
      <div>
        <Label htmlFor="username">
          아이디 <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="username"
            type="text"
            placeholder="4~20자, 영문소문자/숫자/언더바"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={errors.username ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCheckUsername}
            disabled={isCheckingUsername || formData.username.length === 0}
            className="whitespace-nowrap"
          >
            {isCheckingUsername ? "확인 중..." : "중복 확인"}
          </Button>
        </div>
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username}</p>
        )}
        {isUsernameChecked && isUsernameAvailable && (
          <p className="text-sm text-green-500 mt-1">사용 가능한 아이디입니다.</p>
        )}
      </div>

      {/* 비밀번호 */}
      <div>
        <Label htmlFor="password">
          비밀번호 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="10~30자, 영문/숫자 필수"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <Label htmlFor="passwordConfirm">
          비밀번호 확인 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.passwordConfirm}
          onChange={(e) => handleChange("passwordConfirm", e.target.value)}
          className={errors.passwordConfirm ? "border-red-500" : ""}
        />
        {errors.passwordConfirm && (
          <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
        )}
      </div>

      {/* 단체 이름 */}
      <div>
        <Label htmlFor="organizationName">
          단체 이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="organizationName"
          type="text"
          placeholder="단체 이름을 입력하세요"
          value={formData.organizationName}
          onChange={(e) => handleChange("organizationName", e.target.value)}
          className={errors.organizationName ? "border-red-500" : ""}
        />
        {errors.organizationName && (
          <p className="text-sm text-red-500 mt-1">{errors.organizationName}</p>
        )}
      </div>

      {/* 대표자 연락처 */}
      <div>
        <Label htmlFor="phoneNumber">
          대표자 연락처 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="010-1234-5678"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        회원가입
      </Button>
    </form>
  );
}
