import * as Yup from 'yup';

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .required("Please enter the password!")
    .min(1, "Password should be at least 1 character long")
    .max(10, "Password should not be more than 10 characters long"),
});

export const passwordVerificationSchema = Yup.object().shape({
  group_id: Yup.string()
    .required("Group ID is required")
    .test("is-valid-objectid", "Invalid group ID", (value) => {
      return /^[a-f\d]{24}$/i.test(value); // Mimics MongoDB ObjectId check
    }),
  request_id: Yup.string()
    .required("Request ID is required")
    .test("is-valid-objectid", "Invalid request ID", (value) => {
      return /^[a-f\d]{24}$/i.test(value);
    }),
  password: passwordSchema.fields.password,
  role: Yup.string().required("Role is required"),
});
