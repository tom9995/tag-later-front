import { useAtomValue, useSetAtom } from "jotai";
import {
  isAuthenticatedAtom,
  userDataAtom,
  loginAtom,
  logoutAtom,
} from "../atoms/authAtoms";

export const useAuth = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(userDataAtom);
  const executeLogin = useSetAtom(loginAtom);
  const executeLogout = useSetAtom(logoutAtom);

  const login = async (email: string, password: string) => {
    const result = await executeLogin({ email, password });
    return result.success;
  };

  const logout = () => {
    executeLogout();
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
