import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth, setToken } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  //  implement the logic here to check user session
  const signin = (username: string, token: string) => {
    dispatch(setUser({ username }));
    dispatch(setToken(token));
  };
  const signout = () => {
    dispatch(clearAuth());
  };
  return { user, token, signin, signout };
};

export default useAuthSession;
