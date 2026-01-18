import { create } from "zustand"
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useWalletStore = create((set, get) => ({
  loading: false,
  error: null,
  walletHistory: null,


  getWalletHistory: async () => {
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

  
}))

export default useWalletStore
