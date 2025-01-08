"use client";

import { type SigninInput, SignInSchema } from "@/validators/signin-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signinUserAction } from "@/actions/signin-user-actions";

export const SigninForm = () => {
  const form = useForm<SigninInput>({
    resolver: valibotResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: SigninInput) => {
    const res = await signinUserAction(values);

    if (res.success) {
      window.location.href = "/dashboard";
    } else {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error ?? "Internal Server Error";
          setError("password", { message: error });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="max-w-[400px] space-y-8">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jdoe@email.com"
                  {...field}
                  className="w-full rounded-xl bg-gray-800 p-3 text-white placeholder-gray-400 shadow-lg shadow-zinc-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="***********"
                  {...field}
                  className="w-full rounded-xl bg-gray-800 p-3 text-white placeholder-gray-400 shadow-lg shadow-zinc-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full duration-100 ease-in-out hover:scale-100 hover:bg-gray-900"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
