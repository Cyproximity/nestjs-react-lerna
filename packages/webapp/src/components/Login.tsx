import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

import { userStore } from "../stores";
import { apiPublic } from "../api";


interface LoginInputs {
  email: string;
  password: string;
}

async function loginUser(
  email: string,
  password: string,
): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const res = await apiPublic.post("/auth/signin", {
      email,
      password,
    });
    const data = res.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
    }
    return null;
  }
}

export function Login() {
  const { user, setIsLoggedIn, setToken } = userStore();
  const { register, handleSubmit } = useForm<LoginInputs>();
  const [credentials, setCredentials] = useState<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const login = await loginUser(data.email, data.password);
    if (login) {
      setIsLoggedIn(true);
      setToken(login.access_token);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          defaultValue={"gerald0@test.com"}
          {...register("email", { required: true })}
        />
        <input
          type="password"
          defaultValue={"zxcasd"}
          {...register("password", { required: true })}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
