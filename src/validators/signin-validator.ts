import * as v from "valibot";

export const SignInSchema = v.object({
  email: v.pipe(
    v.string("Your email must be a string"),
    v.nonEmpty("Your email must not be empty"),
    v.email("Your email must be a valid email"),
  ),
  password: v.pipe(
    v.string("Your password must be a string"),
    v.nonEmpty("Your password must not be empty"),
  ),
});

export type SigninInput = v.InferInput<typeof SignInSchema>;
