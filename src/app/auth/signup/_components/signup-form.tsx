"use client";

import { signupUserAction } from "@/actions/signup-user-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SignupInput, SignUpSchema } from "@/validators/signup-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const SignupForm = () => {
  const [success, setSuccess] = useState(false);
  const form = useForm<SignupInput>({
    resolver: valibotResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: SignupInput) => {
    const res = await signupUserAction(values);
    if (res.success) {
      setSuccess(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="max-w-[400px] space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...field}
                  className="w-full rounded-xl bg-gray-800 p-3 text-white placeholder-gray-400 shadow-lg shadow-zinc-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Optional
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm Password</FormLabel>
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
          className="group relative w-full cursor-pointer rounded-xl bg-gray-800 px-1 py-3 font-semibold leading-6 text-white shadow-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[5px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10 block w-full rounded-xl bg-gray-950 px-3 py-1">
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="transition-all duration-500 group-hover:translate-x-1">
                Sign Up
              </span>
              <svg
                className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-1"
                data-slot="icon"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
          </span>
        </Button>
      </form>
    </Form>
  );
};
