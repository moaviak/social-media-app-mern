import { useGetAllChatsQuery } from "@/app/api/chatApiSlice";
import { Loader } from "@/components/shared";
import Chat from "@/components/shared/Chat";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import ChatFrame from "./ChatFrame";
import useMediaQuery from "@/hooks/useMediaQuery";

const Chats = () => {
  const { data: chats, isLoading } = useGetAllChatsQuery(null);

  const location = useLocation();

  const isChatSelected = location.pathname.includes("/chats/");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="chats_page-container">
      {(isDesktop || !isChatSelected) && (
        <div className="chats_page-all_chats">
          <div className="flex gap-2 lg:gap-4 items-center justify-center md:justify-normal px-2 lg:px-6">
            <img
              src="/assets/icons/chat.svg"
              alt="chat-icon"
              className="h-8 w-8 md:h-7 md:w-7 lg:h-9 lg:w-9 invert-white"
            />
            <h2 className="h3-bold md:body-bold lg:h2-bold">All Chats</h2>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="chats_page-all_chats-chats">
              {chats?.map((chat) => (
                <Link key={chat._id} to={`/chats/${chat._id}`}>
                  <Chat chat={chat} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {isDesktop && <Outlet />}

      <Routes>
        {isDesktop && (
          <Route index element={<p className="w-[65%]">Select Chat</p>} />
        )}
        <Route path="/:id" element={<ChatFrame />} />
      </Routes>
    </div>
  );
};
export default Chats;
