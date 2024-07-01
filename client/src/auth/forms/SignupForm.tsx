import { useSignupMutation } from "@/app/api/authApiSlice";
import {
  Form,
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/components/ui";
import { useToast } from "@/components/ui/use-toast";
import { IError } from "@/lib/utils";
import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { z } from "zod";
import { setCredentials } from "@/app/authSlice";

const SignupForm = () => {
  const [signUp, { isLoading: isCreatingAccount }] = useSignupMutation();

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSigningInUser = isCreatingAccount;
  const isUserLoading = isSigningInUser;

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const { accessToken } = await signUp(user).unwrap();
      dispatch(setCredentials(accessToken));
      form.reset();
      navigate("/");
    } catch (error) {
      const err = error as IError;
      if (err.data && err.data.message) toast({ title: err.data.message });
      else toast({ title: "Something went wrong!" });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-10">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    placeholder="Name"
                  />
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
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    placeholder="Username"
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
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    {...field}
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <PulseLoader color="#fff" size={8} />
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SignupForm;
