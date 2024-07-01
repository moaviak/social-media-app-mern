import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useRefreshTokenMutation } from "@/app/api/authApiSlice";
import { selectCurrentToken, setCredentials } from "@/app/authSlice";
import { AppDispatch } from "@/app/store";
import { PulseLoader } from "react-spinners";

const PersistLogin = () => {
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const effectRan = useRef(false);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const refreshResult = await refreshToken({}).unwrap();
        const { accessToken } = refreshResult;
        dispatch(setCredentials({ token: accessToken }));
      } catch {
        navigate("/sign-in");
      }
    };

    if (!token && !effectRan.current) {
      verifyRefreshToken();
      effectRan.current = true;
    }
  }, [token, refreshToken, dispatch, navigate]);

  if (isLoading || !token) {
    return (
      <div className="flex w-full h-[100vh] items-center justify-center">
        <PulseLoader color="#fff" />
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
