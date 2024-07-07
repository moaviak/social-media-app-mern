import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSendLogoutMutation } from "@/app/api/authApiSlice";
import useAuth from "@/hooks/useAuth";

const Topbar = () => {
  const navigate = useNavigate();
  const user = useAuth();

  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={sendLogout}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user?.id}`} className="flex-center gap-3">
            <img
              src={
                user?.profilePicture || "/assets/icons/profile-placeholder.svg"
              }
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
