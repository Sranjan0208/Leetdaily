import * as v from "valibot";

export const SignUpSchema = v.pipe(
  v.object({
    name: v.optional(
      v.union([
        v.pipe(
          v.literal(""),
          v.transform(() => undefined),
        ),
        v.pipe(
          v.string("Your name must be a string"),
          v.nonEmpty("Your name must not be empty"),
          v.minLength(2, "Your name must be at least 2 characters long"),
        ),
      ]),
    ),
    email: v.pipe(
      v.string("Your email must be a string"),
      v.nonEmpty("Your email must not be empty"),
      v.email("Your email must be a valid email"),
    ),
    password: v.pipe(
      v.string("Your password must be a string"),
      v.nonEmpty("Your password must not be empty"),
      v.minLength(6, "Your password must be at least 6 characters long"),
    ),
    confirmPassword: v.pipe(
      v.string("Your password confirmation must be a string"),
      v.nonEmpty("Your password confirmation must not be empty"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Your password and password confirmation do not match",
    ),
    ["confirmPassword"],
  ),
);

export type SignupInput = v.InferInput<typeof SignUpSchema>;
