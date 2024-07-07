import useMediaQuery from "@/hooks/useMediaQuery";
import { lazy, Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { IPost } from "@/types";
import Loader from "./Loader";

const CommentsList = lazy(() => import("./CommentsList"));
const CommentForm = lazy(() => import("../forms/CommentForm"));

const CommentsView = ({ post }: { post: IPost }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const commentsLength = post.comments ? post.comments.length : 0;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p
            className={`${
              commentsLength === 0 && "hidden"
            } text-light-3 p-0 small-medium lg:base-regular decoration-transparent cursor-pointer`}
          >
            {`View all ${commentsLength} comments`}
          </p>
        </DialogTrigger>
        <DialogContent className="md:flex flex-col items-center md:w-[60%] xl:w-[40%] md:h-[90vh] bg-dark-2 overflow-hidden">
          <div className="flex flex-col justify-between w-full h-full">
            <DialogHeader>
              <DialogTitle className="text-center">Comments</DialogTitle>
            </DialogHeader>
            <Suspense fallback={<Loader />}>
              <CommentsList post={post} />
              <CommentForm post={post} />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <p
          className={`${
            commentsLength === 0 && "hidden"
          } text-light-3 p-0 small-medium lg:base-regular decoration-transparent cursor-pointer`}
        >
          {`View all ${commentsLength} comments`}
        </p>
      </DrawerTrigger>
      <DrawerContent className="shadcn-drawer_header bg-dark-2 border-dark-3 py-4 border-0 outline-0 shadow-none h-[80vh] max-h-[100vh] px-4">
        <div className="flex flex-col justify-between w-full h-full overflow-hidden">
          <DrawerHeader>
            <DialogTitle className="text-center flex-1">Comments</DialogTitle>
          </DrawerHeader>
          <Suspense fallback={<Loader />}>
            <CommentsList post={post} />
            <CommentForm post={post} />
          </Suspense>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentsView;
