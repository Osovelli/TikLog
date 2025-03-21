import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  adminData: null,
  isSignup: false,
  isLoggedIn: false,
  isOtp: false,
  isProfileComplete: false,
  loading: false,
  error: null,
  showErrorModal: false,

  login: async ({phone_number, password}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/user', { phone_number, password });
      const token  = response.data?.data?.token;
      const user = response.data?.data;
      console.log("LOGIN token", response)
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refresh_token      );
      set({ user: user, loading: false, isLoggedIn: true });
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage)
      set({ loading: false, error: 'Login failed. Please check your credentials.', showErrorModal: true });
    }
  },

  signup: async ({ email, phone_number, country_code, password }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/user/create', {
        email,
        phone_number,
        country_code,
        password
      });
      toast.success("Signup successful");
      set({ isSignup: true, loading: false })
      console.log("SIGNUP RESPONSE", response)
      /* return { success: true, data: response.data }; */
    } catch (error) {
      console.error("Signup failed", error);
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage, showErrorModal: true });
      /* return { success: false, error: errorMessage }; */
    }
  },

  verifyOtp: async ({ otp }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/user/verify_otp', {
        otp
      });
      toast.success("otp verified");
      set({ isOtp: true, loading: false })
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      console.log("OTP RESPONSE", response)
      /* return { success: true, data: response.data }; */
    } catch (error) {
      console.error("OTP failed", error);
      const errorMessage = error.response?.data?.message || "OTP failed. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage, showErrorModal: true });
      /* return { success: false, error: errorMessage }; */
    }
  },

  getToKnow: async ({ firstname, lastname, othername, dob, isOnboarded, }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put('/user/onboarding', {
        firstname,
        lastname,
        othername,
        isOnboarded,
        dob,
      });
      toast.success("Profile updated successfully");
      set({ isProfileComplete: true, loading: false })
      console.log("Profile data: ", response)
      /* return { success: true, data: response.data }; */
    } catch (error) {
      console.error("Proile submission failed", error);
      const errorMessage = error.response?.data?.message || "submission failed. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage, showErrorModal: true });
      /* return { success: false, error: errorMessage }; */
    }
  },

  getMe: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/user/me');
      console.log("GET ME RESPONSE", res.data)
      set({  loading: false,  user: res.data?.data});
      console.log("single client result", res.data?.data)
    } catch (error) {
      set({ error: error.response?.data?.message || "Error Fetching User", loading: false });
      console.log(error);
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  updateUser: async ({ firstname, lastname, othername, dob, isOnboarded, }) => {
    set({ loading: true, error: null, isProfileComplete: false });
    try {
      const response = await axiosInstance.put('/user/update', {
        firstname,
        lastname,
        othername,
        isOnboarded,
        dob,
      });
      toast.success("Profile updated successfully");
      set({ isProfileComplete: true, loading: false })
      console.log("Profile data: ", response)
      /* return { success: true, data: response.data }; */
    } catch (error) {
      console.error("Proile submission failed", error);
      const errorMessage = error.response?.data?.message || "submission failed. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage, showErrorModal: true });
      /* return { success: false, error: errorMessage }; */
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, isLoggedIn: false });
  },
  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useAuthStore;