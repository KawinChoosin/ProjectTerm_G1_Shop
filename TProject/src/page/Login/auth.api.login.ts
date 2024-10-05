import Axios, { AxiosRequestConfig } from "axios";

export interface Credentials {
  C_name: string;
  C_password: string;
}

export const onLogin = async (data: Credentials) => {
  const requestConfig: AxiosRequestConfig = {
    method: "post",
    url: `${import.meta.env.VITE_APP_API_BASE_URL}/login`, // Ensure this points to the correct backend URL
    data,
  };

  try {
    const { data: response } = await Axios.request(requestConfig);
    return response; // Return the response if the request is successful
  } catch (e: any) {
    console.error("Error details:", e);
    const errorMessage = e.response
      ? e.response.data.message
      : "Unexpected error occurred";
    return { error: errorMessage };
  }
};
