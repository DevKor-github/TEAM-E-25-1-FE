/**
 * Validates password according to organization signup requirements
 * @param password - The password to validate
 * @returns Error message if validation fails, null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (password.length < 10 || password.length > 30) {
    return "비밀번호는 10자 이상 30자 이하여야 합니다.";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "비밀번호는 영문과 숫자를 모두 포함해야 합니다.";
  }
  return null;
};
