import { create } from "zustand"
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useWalletStore = create((set, get) => ({
  loading: false,
  error: null,
  //walletHistory: null,
  walletDetails: null,

  createDeposit: async ({ amount }) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post('/wallet/deposit/manual', { amount });
        console.log("Deposit created:", response.data);
        //toast.success("Deposit initiated successfully! Please check your email for further instructions.");
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to create deposit",
        });
        toast.error("Failed to create deposit");
        console.error("Error creating deposit:", error);
    } finally {
        set({ loading: false });
    }
  },

  verifyDeposit: async (reference) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post('/wallet/deposit/manual/verify', { reference });
        console.log("Deposit verified:", response.data);
        //toast.success("Deposit verified successfully!");
        
        // Refresh wallet history and details after successful deposit
        //get().getWalletHistory();
        get().getUserWalletDetails();
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to verify deposit",
        });
        toast.error("Failed to verify deposit");
        console.error("Error verifying deposit:", error);
    } finally {
        set({ loading: false });
    }
  },

  createWithdrawalOtp: async () => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post(`/wallet/withdraw/send-otp`);
        console.log("Withdrawal OTP created:", response.data);
        toast.success("Withdrawal OTP sent successfully! Please check your email.");
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to create withdrawal OTP",
        });
        toast.error("Failed to create withdrawal OTP");
        console.error("Error creating withdrawal OTP:", error);
    } finally {
        set({ loading: false });
    }
  },

  verifyWithdrawal: async ({ amount, otp, bankAccountId, reason}) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post(`/wallet/withdraw/verify-otp`, { 
            amount, 
            otp, 
            bankAccountId, 
            reason }
        );
        console.log("Withdrawal verified:", response.data);
        toast.success("Withdrawal processed successfully!");
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to verify withdrawal",
        });
        toast.error("Failed to verify withdrawal");
        console.error("Error verifying withdrawal:", error);
    } finally {
        set({ loading: false });
    }
  },

  validateTransferPhoneNumber: async ( phone, ownerType ) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post(`/wallet/validate-phone`, { phone, ownerType });
        console.log("Phone number validated:", response.data);
        toast.success("Phone number validated successfully!");
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to validate phone number",
        });
        toast.error(error?.response?.data?.message);
        console.error("Error validating phone number:", error);
    } finally {
        set({ loading: false });
    }
  },

  transferToUser: async (amount, description, recipientOwnerType, recipientPhone) => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.post(`/wallet/transfer`, { amount, description, recipientOwnerType, recipientPhone });
        console.log("Transfer initiated:", response.data);
        toast.success("Transfer initiated successfully!");
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to initiate transfer",
        });
        toast.error("Failed to initiate transfer");
        console.error("Error initiating transfer:", error);
    } finally {
        set({ loading: false });
    }
  },

  getUserWalletDetails: async () => {
    set({ loading: true, error: null });
    try {
        const response = await axiosInstance.get(`/wallet/wallet-details`);
        console.log("Wallet details fetched:", response.data);
        toast.success("Wallet details fetched successfully!");
        set({ walletDetails: response.data?.data });
        return response.data;
    } catch (error) {
        set({
            error: error?.response?.data?.message || "Failed to fetch wallet details",
        });
        console.error("Error fetching wallet details:", error);
    } finally {
        set({ loading: false });
    }
  },

  /* getWalletHistory: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/history/wallet-history`);
            console.log("Wallet History fetched:", response.data.data);
            //toast.success("Referral fetched successfully!");
            set({ 
              loading: false, 
              walletHistory: response?.data?.data, 
            });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch wallet history",
                showErrorModal: true
            });
            //toast.error("Failed to fetch notifications");
            console.error("Error fetching wallet history:", error)
            return null;
        }
        finally {
            set({ loading: false });
        }
    }
 */
  
}))

export default useWalletStore
