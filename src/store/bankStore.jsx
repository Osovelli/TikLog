import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useBankStore = create((set, get) => ({
    loading: false,
    error: null,
    banks: null,

    getBanks: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/banks`);
            console.log("Banks fetched:", response.data.data);
            set({ banks: response.data.data });
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to fetch banks",
            });
            console.error("Error fetching banks:", error)
        } finally {
            set({ loading: false });
        }
    },

    validateBankAccount: async (accountNumber, bankCode) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(`/bank/validate`, { accountNumber, bankCode });
            console.log("Bank account validated:", response.data);
            return response.data;
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to validate bank account",
            });
            console.error("Error validating bank account:", error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useBankStore;