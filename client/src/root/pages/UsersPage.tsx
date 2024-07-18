import {
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useSearchUsersQuery,
} from "@/app/api/userApiSlice";
import UserSkeleton from "@/components/skeletons/UserSkeleton";
import { Input } from "@/components/ui";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import UsersList from "@/components/shared/UsersList";

const UsersPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const user = useAuth();

  const { data: followers, isLoading: isFollowersLoading } =
    useGetUserFollowersQuery(id || "");
  const { data: following, isLoading: isFollowingLoading } =
    useGetUserFollowingQuery(id || "");

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data: searchedUsers, isFetching: isSearchFetching } =
    useSearchUsersQuery({ term: debouncedSearch }, { skip: !debouncedSearch });

  if (!followers || !following) return;

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowUsers = !shouldShowSearchResults;

  return (
    <div className="w-full pb-14 custom-scrollbar overflow-scroll">
      {id === user.id && (
        <div className="explore-inner_container p-6">
          <h2 className="h3-bold md:h2-bold w-full">Search People</h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
            <img
              src="/assets/icons/search.svg"
              width={24}
              height={24}
              alt="search"
            />
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => {
                const { value } = e.target;
                setSearchValue(value);
              }}
            />
          </div>
        </div>
      )}
      {shouldShowUsers ? (
        <div>
          <div className="flex pb-6 w-full">
            <Link
              to={`/users/${id}`}
              className={`flex-center gap-3 py-4 w-48  transition flex-1 ${
                pathname === `/users/${id}` &&
                "!bg-dark-3 !border-b-2 !border-white"
              }`}
            >
              Followers
            </Link>
            <Link
              to={`/users/${id}/following`}
              className={`flex-center gap-3 py-4 w-48  transition flex-1 ${
                pathname === `/users/${id}/following` &&
                "!bg-dark-3 !border-b-2 !border-white"
              }`}
            >
              Following
            </Link>
          </div>
          {isFollowersLoading ||
            (isFollowingLoading && (
              <ul className="user-grid">
                {[...Array(3)].map((i) => (
                  <UserSkeleton key={i} />
                ))}
              </ul>
            ))}
          <Routes>
            <Route
              index
              element={<UsersList title="Followers" users={followers} />}
            />
            <Route
              path="/following"
              element={<UsersList title="Following" users={following} />}
            />
          </Routes>

          <Outlet />
        </div>
      ) : isSearchFetching ? (
        <ul className="user-grid">
          {[...Array(3)].map((i) => (
            <UserSkeleton key={i} />
          ))}
        </ul>
      ) : !searchedUsers || searchedUsers.length === 0 ? (
        <p className="text-light-4 mt-10 text-center w-full">No users found</p>
      ) : (
        <UsersList title="Search Results" users={searchedUsers} />
      )}
    </div>
  );
};
export default UsersPage;
