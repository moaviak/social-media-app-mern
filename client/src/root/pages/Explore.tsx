import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PulseLoader } from "react-spinners";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPopularPostsQuery,
  useSearchPostsQuery,
} from "@/app/api/postApiSlice";
import { IPost } from "@/types";
import { Input } from "@/components/ui";

const GridPostList = lazy(() => import("@/components/shared/GridPostList"));

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts?: IPost[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <PulseLoader color="#fff" />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const postSet = useRef(new Set<string>());

  const {
    data,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    isFetching: isPostsFetching,
  } = useGetPopularPostsQuery({ page });

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPostsQuery({ term: debouncedSearch }, { skip: !debouncedSearch });

  useEffect(() => {
    if (data?.popularPosts && data?.popularPosts.length) {
      const newPosts = data.popularPosts.filter(
        (post) => !postSet.current.has(post._id)
      );
      newPosts.forEach((post) => postSet.current.add(post._id));
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }
  }, [data]);

  useEffect(() => {
    if (isPostsFetching) return;

    if (inView && data?.nextPage && !searchValue) {
      setPage((prev) => prev + 1);
    }
  }, [data?.nextPage, inView, isPostsFetching, searchValue]);

  if (!posts || isPostLoading)
    return (
      <div className="flex-center w-full h-full">
        <PulseLoader color="#fff" />
      </div>
    );

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts && posts.length > 0;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
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

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">
          {shouldShowSearchResults ? "Search Results" : "Popular Today"}
        </h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <Suspense fallback={<PulseLoader color="#fff" />}>
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchedPosts={searchedPosts}
            />
          </Suspense>
        ) : shouldShowPosts ? (
          <Suspense fallback={<PulseLoader color="#fff" />}>
            <GridPostList posts={posts} />
          </Suspense>
        ) : isErrorPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">
            Something bad happen
          </p>
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        )}
      </div>

      {data?.nextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <PulseLoader color="#fff" />
        </div>
      )}
    </div>
  );
};

export default Explore;
