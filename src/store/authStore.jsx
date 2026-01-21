import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";


const useAuthStore = create((set) => ({
  user: null,
  walletDetails: null,
  token: null,
  adminData: null,
  isSignup: false,
  isLoggedIn: false,
  isOtp: false,
  isProfileComplete: false,
  loading: false,
  error: null,
  showErrorModal: false,

  login: async ({phone, password}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/customer/login', { phone, password });
      const token  = response.data?.data?.token;
      const user = response.data?.data;
      console.log("LOGIN token", response);
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refresh_token);
      set({ user: user, loading: false, isLoggedIn: true });
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage)
      set({ loading: false, error: 'Login failed. Please check your credentials.', showErrorModal: true });
    }
  },

  resetPassword: async ({ email, newPassword }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/customer/reset-password', {
        email,
        newPassword
      });
      console.log("Reset Password Response", response)
      toast.success(response.data.message);
      return response;
    } catch (error) {
      console.error("Reset Password failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Reset Password failed.'})
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async ({email}) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/auth/customer/forgot-password", { email });
			set({  loading: false, sendToken: true  });
			toast.success(res.data.message);
			return res;
		} catch (error) {
			set({loading: false, error: error.response?.data?.message || "Error Creating price", sendToken: null})
			console.log("Error Reseting Password", error)
			throw error;
		}
	},

	changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/customer/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      console.log("Reset Password Response", response)
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Reset Password failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Reset Password failed.'})
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyResetOtp: async ({email, otp}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('auth/customer/verify-reset-otp', {email, otp});
      console.log("OTP Verification Response", response)
      toast.success("Reset OTP verified successfully");
      return response;
    } catch (error) {
      console.error("Verify OTP failed", error);
      toast.error(error.response.data.message)
      set({ loading: false, error: 'Verify OTP failed.'})
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signup: async ({ email, phone, code, password }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/customer/register', {
        email,
        phone,
        code,
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

  verifyOtp: async ({ email, otp }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/customer/verify-otp', {
        email,
        otp
      });
      toast.success("otp verified");
      set({ isOtp: true, loading: false })
      localStorage.setItem('accessToken', response.data?.data?.token);
      //localStorage.setItem('refreshToken', response.data.data.refreshToken);
      /* return { success: true, data: response.data }; */
    } catch (error) {
      console.error("OTP failed", error);
      const errorMessage = error.response?.data?.message || "OTP failed. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: errorMessage, showErrorModal: true });
      /* return { success: false, error: errorMessage }; */
    }
  },

// Updated getToKnow function for authStore

getToKnow: async ({ profileImage, firstname, lastname, othername, email, dob, referralCode }) => {
  set({ loading: true, error: null });

  try {
    // Prepare the payload
    const payload = {
      firstname,
      lastname,
      othername: othername || '',
      email: email || '',
      dob,
      referralCode: referralCode || '',
    }

    // Add profile image if provided
    if (profileImage) {
      payload.profileImage = {
        url: profileImage.url,
        publicId: profileImage.publicId,
      }
    }

    console.log('Sending to API:', payload)

    const response = await axiosInstance.put('/onboarding/customer/profile-onboard', payload);
    
    toast.success("Profile updated successfully");
    set({ 
      isProfileComplete: true, 
      loading: false,
      user: response.data?.data?.user || null 
    })
    
    console.log("Profile data: ", response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error("Profile submission failed", error);
    const errorMessage = error.response?.data?.message || "Submission failed. Please try again.";
    toast.error(errorMessage);
    set({ 
      loading: false, 
      error: errorMessage, 
      showErrorModal: true 
    });
    return { success: false, error: errorMessage }
  }
},

  getMe: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/onboarding/customer/profile');
      console.log("GET ME RESPONSE", res.data)
      set({  loading: false,  user: res.data?.data?.profile, walletDetails: res.data?.data?.wallet  });
      //console.log("single client result", res.data?.data)
    } catch (error) {
      set({ error: error.response?.data?.message || "Error Fetching User", loading: false });
      console.log(error);
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  updateUser: async ({ firstname, lastname, othername, dob, profileImage, isOnboarded, }) => {
    set({ loading: true, error: null, isProfileComplete: false });
    try {
      const response = await axiosInstance.put('/customer/profile', {
        firstname,
        lastname,
        othername,
        profileImage,
        isOnboarded,
        dob,
      });
      toast.success("Profile updated successfully");
      set({ isProfileComplete: true, user: response.data?.data?.user, loading: false });
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