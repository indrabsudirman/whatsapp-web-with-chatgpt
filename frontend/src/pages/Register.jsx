import { Form, redirect, Link, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "../components/Logo";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);

    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  console.log(navigation);
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          type="text"
          name="fullName"
          labelText="Full Name"
          defaultValue="Indra Bayu Sudirman"
        />
        <FormRow
          type="tel"
          name="phoneNumber"
          labelText="Phone Number"
          defaultValue="089636002345"
          minLength="8"
          maxLength="14"
        />
        <FormRow
          type="email"
          name="email"
          defaultValue="indra.indrabayu@gmail.com"
        />
        <FormRow
          type="password"
          name="password"
          defaultValue="Qwerty12345"
          minLength="10"
          maxLength="20"
        />
        <FormRow
          type="password"
          name="confirmPassword"
          labelText="Confirm Password"
          defaultValue="Qwerty12345"
          minLength="10"
          maxLength="20"
        />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "Submitting ..." : "Submit"}
        </button>
        <p>
          Already have account?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
