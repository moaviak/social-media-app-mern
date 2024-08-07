import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { SigninValidation } from "@/lib/validation";
import { useLoginMutation } from "@/app/api/authApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { IError } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/authSlice";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const { accessToken } = await login(user).unwrap();

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
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
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
            {isLoading ? (
              <div className="flex-center gap-2">
                <PulseLoader color="#fff" size={8} />
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SigninForm;
