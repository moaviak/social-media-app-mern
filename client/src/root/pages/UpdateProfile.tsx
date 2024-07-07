import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Textarea, Input, Button } from "@/components/ui";
import { Loader } from "@/components/shared";

import { ProfileValidation } from "@/lib/validation";
import useAuth from "@/hooks/useAuth";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/app/api/userApiSlice";
import { useRefreshTokenMutation } from "@/app/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/authSlice";
import { lazy, Suspense } from "react";
import { PulseLoader } from "react-spinners";

const ProfileUploader = lazy(
  () => import("@/components/shared/ProfileUploader")
);

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAuth();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  // Queries
  const { data: currentUser } = useGetUserByIdQuery(user?.id || "");
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  const [refreshToken, { isLoading: isLoadingToken }] =
    useRefreshTokenMutation();

  if (!user) return;

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    try {
      const formData = new FormData();

      formData.append("name", value.name);
      formData.append("bio", value.bio);
      formData.append("file", value.file[0] ? value.file[0] : "");

      await updateUser(formData).unwrap();

      const refreshResult = await refreshToken({}).unwrap();
      const { accessToken } = refreshResult;

      dispatch(setCredentials({ token: accessToken }));

      toast({ title: "Profile successfully Updated" });

      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.log(error);
      toast({ title: "Error updating profile" });
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Suspense fallback={<PulseLoader color="#fff" />}>
                      <ProfileUploader
                        fieldChange={field.onChange}
                        mediaUrl={currentUser.profilePicture}
                      />
                    </Suspense>
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}
              >
                {(isLoadingUpdate || isLoadingToken) && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
