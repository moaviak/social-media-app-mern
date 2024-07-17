import { useGetAllChatsQuery } from "@/app/api/chatApiSlice";
import Chat from "@/components/shared/Chat";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import ChatFrame from "./ChatFrame";
import useMediaQuery from "@/hooks/useMediaQuery";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { Input } from "@/components/ui";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useSearchUsersQuery } from "@/app/api/userApiSlice";

const Chats = () => {
  const { data: chats, isLoading } = useGetAllChatsQuery(null);
  const location = useLocation();
  const isChatSelected = location.pathname.includes("/chats/");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data: searchedUsers } = useSearchUsersQuery(
    { term: debouncedSearch },
    { skip: !debouncedSearch }
  );

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowChats = !shouldShowSearchResults;

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
            <ChatSkeleton />
          ) : (
            <div className="chats_page-all_chats-chats">
              <Input
                type="text"
                placeholder="Search People..."
                className="explore-search"
                value={searchValue}
                onChange={(e) => {
                  const { value } = e.target;
                  setSearchValue(value);
                }}
              />
              {shouldShowChats
                ? chats?.map((chat) => (
                    <Link key={chat._id} to={`/chats/${chat.sender._id}`}>
                      <Chat chat={chat} />
                    </Link>
                  ))
                : searchedUsers?.map((user) => (
                    <Link key={user._id} to={`/chats/${user._id}`}>
                      <Chat user={user} />
                    </Link>
                  ))}
            </div>
          )}
        </div>
      )}

      {isDesktop && <Outlet />}

      <Routes>
        {isDesktop && (
          <Route
            index
            element={
              <div className="w-[65%] flex flex-col items-center justify-center">
                <img
                  src="/assets/icons/chat.svg"
                  alt="message"
                  className="h-20 w-20 invert-white mb-2"
                />
                <p className="body-medium tracking-wide">Your Messages</p>
                <p className="text-light-3 small-medium">
                  Send a message to start a chat.
                </p>
              </div>
            }
          />
        )}
        <Route path="/:id" element={<ChatFrame />} />
      </Routes>
    </div>
  );
};
export default Chats;
