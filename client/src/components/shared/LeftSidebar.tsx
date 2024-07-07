import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "react-spinners";
import { useSendLogoutMutation } from "@/app/api/authApiSlice";
import useAuth from "@/hooks/useAuth";

const LeftSidebar = () => {
  const user = useAuth();

  const [sendLogout, { isLoading: isLogingOut }] = useSendLogoutMutation();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  sidebarLinks.forEach((sidebarLink) => {
    if (sidebarLink.label === "People") {
      sidebarLink.route = `/users/${user?.id || ""}`;
    }
  });

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await sendLogout({});
    navigate("/sign-in");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLogingOut ? (
          <div className="h-14">
            <PulseLoader color="#fff" />
          </div>
        ) : (
          <Link to={`/profile/${user?.id}`} className="flex gap-3 items-center">
            <img
              src={
                user?.profilePicture || "/assets/icons/profile-placeholder.svg"
              }
              alt="profile"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user?.name}</p>
              <p className="small-regular text-light-3">@{user?.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive =
              pathname === link.route || pathname === link.route + "/following";

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-3"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};
export default LeftSidebar;
