import { useLikeCommentMutation } from "@/app/api/commentApiSlice";
import useAuth from "@/hooks/useAuth";
import { checkIsLiked, multiFormatDateString } from "@/lib/utils";
import { IComment } from "@/types";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

const Comment = ({ comment }: { comment: IComment }) => {
  const user = useAuth();
  const [likes, setLikes] = useState<string[]>(comment.likes);
  const [isLiked, setIsLiked] = useState(checkIsLiked(comment.likes, user.id));

  const [likeComment] = useLikeCommentMutation();

  const handleLikeComment = async () => {
    let likesArray = [...likes];
    const newIsLiked = !isLiked;

    if (newIsLiked) {
      likesArray.push(user.id);
    } else {
      likesArray = likesArray.filter((Id) => Id !== user.id);
    }

    setLikes(likesArray);
    setIsLiked(newIsLiked);
    await debouncedLikeComment(comment._id, newIsLiked);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLikeComment = useCallback(
    debounce(async (commentId: string, isLiked: boolean) => {
      await likeComment({ commentId, isLiked });
    }, 300),
    []
  );

  if (!comment.user) return;

  return (
    <li className="flex gap-2 w-full">
      <Link to={`/profile/${comment.user._id}`}>
        <img
          src={
            comment.user.profilePicture ||
            "/assets/icons/profile-placeholder.svg"
          }
          className="w-9 h-9 object-cover rounded-full"
        />
      </Link>
      <div className="flex flex-col flex-[8]">
        <div className="flex gap-2">
          <p className="text-light-3 small-semibold">{comment.user.username}</p>
          <p className="small-medium">{comment.text}</p>
        </div>
        <p className="text-light-4 small-regular">
          {multiFormatDateString(comment.createdAt, true)}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <img
          src={`${
            isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikeComment}
          className="cursor-pointer"
        />
        <p className="text-light-4 small-regular">{likes.length}</p>
      </div>
    </li>
  );
};
export default Comment;
