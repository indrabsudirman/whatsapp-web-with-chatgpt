import {
  Form,
  redirect,
  Link,
  useNavigation,
  useActionData,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "../components/Logo";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const errors = { msg: "" };
    if (data.password.length < 5) {
      errors.msg = "Password too short";
      toast.error(errors.msg);
      return errors;
    }
    try {
      await customFetch.post("/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful");
      return redirect("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

function Login() {
  // const errors = useActionData();
  const navigation = useNavigation();
  console.log(navigation);
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="POST" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow
          type="tel"
          name="phoneNumber"
          labelText="Phone Number"
          defaultValue="089636002345"
          minLength="8"
          maxLength="14"
        />
        <FormRow type="password" name="password" defaultValue="Qwerty12345" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "Submitting ..." : "Submit"}
        </button>
        <p>
          Don't have an account?
          <Link to="/register" className="member-btn">
            Register Now
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
}

export default Login;
