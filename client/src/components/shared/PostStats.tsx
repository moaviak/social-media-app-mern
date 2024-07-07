/* eslint-disable react-hooks/exhaustive-deps */

import {
  useLikePostMutation,
  useSavePostMutation,
} from "@/app/api/postApiSlice";
import { useGetUserByIdQuery } from "@/app/api/userApiSlice";
import { checkIsLiked } from "@/lib/utils";
import { IPost } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import useAuth from "@/hooks/useAuth";

type PostStatsProps = {
  post: IPost;
};

const PostStats = ({ post }: PostStatsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id: userId } = useAuth();

  const { data: currentUser } = useGetUserByIdQuery(userId);

  const savedPostRecord = currentUser?.savedPosts.find(
    (postId) => postId === post._id
  );

  const [likes, setLikes] = useState<string[]>(post.likes);
  const [isSaved, setIsSaved] = useState(!!savedPostRecord);
  const [isLiked, setIsLiked] = useState(checkIsLiked(post.likes, userId));

  const [likePost] = useLikePostMutation();

  const [savePost] = useSavePostMutation();

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];
    const newIsLiked = !isLiked;

    if (newIsLiked) {
      likesArray.push(userId);
    } else {
      likesArray = likesArray.filter((Id) => Id !== userId);
    }

    setLikes(likesArray);
    setIsLiked(newIsLiked);
    await debouncedLikePost(post._id, newIsLiked);
  };

  const debouncedLikePost = useCallback(
    debounce(async (postId: string, isLiked: boolean) => {
      await likePost({ postId, isLiked });
    }, 300),
    []
  );

  const handleSavePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const newIsSaved = !isSaved;

    setIsSaved(newIsSaved);
    debouncedSavePost(post._id, newIsSaved);
  };

  const debouncedSavePost = useCallback(
    debounce(async (postId: string, isSaved: boolean) => {
      await savePost({ postId, isSaved });
    }, 300),
    []
  );

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles} w-full`}
    >
      <div className="flex gap-2 mr-5">
        <div className="flex gap-2 mr-5">
          <img
            src={`${
              isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={20}
            height={20}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2 mr-5">
          <img
            src="/assets/icons/chat.svg"
            alt="like"
            width={20}
            height={20}
            onClick={() => navigate(`/posts/${post._id}`)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">
            {post.comments?.length || 0}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};
export default PostStats;
