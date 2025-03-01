import axios from "axios";

const baseInstanceWithoutAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

function handleApiError(error) {
  if (axios.isAxiosError(error) && error.response) {
    // Handle cases where error is an AxiosError and response is available

    return {
      success: false,
      message: error?.response?.data.error ?? error?.response?.data.message,
      data: error?.response?.data ?? {},
    };
  } else if (axios.isAxiosError(error) && error.request) {
    // Handle cases where error is an AxiosError and request is available
    return {
      success: false,
      message: "Network error. Please check your internet connection.",
    };
  }
  // Fallback for other types of errors
  return {
    success: false,
    message: "An unexpected error occurred.",
  };
}

export const postApiWithoutAuth = async (url, body) => {
  // removeApiHeader();
  try {
    const result = await baseInstanceWithoutAuth.post(url, body);
    return { data: result.data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getApiWithoutAuth = async (url) => {
  // removeApiHeader();
  try {
    const response = await baseInstanceWithoutAuth.get(url);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
