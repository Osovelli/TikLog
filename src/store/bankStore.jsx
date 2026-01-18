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
            const response = await axiosInstance.get(`bank/get-all-banks`);
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

    getBankById: async (bankId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/bank/${bankId}`);
            console.log("Bank fetched by ID:", response.data);
            return response.data;
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to fetch bank by ID",
            });
            console.error("Error fetching bank by ID:", error);
        } finally {
            set({ loading: false });
        }
    },

    deleteBankAccount: async (accountId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/bank/${accountId}`);
            console.log("Bank account deleted:", response.data);
            toast.success("Bank account deleted successfully!");
            return response.data;
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to delete bank account",
            });
            toast.error("Failed to delete bank account");
            console.error("Error deleting bank account:", error);
        } finally {
            set({ loading: false });
        }
    },

    setDefaultBankAccount: async (accountId) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put(`bank/set-default/${accountId}`);
            console.log("Default bank account set:", response.data);
            toast.success("Default bank account set successfully!");
            return response.data;
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to set default bank account",
            });
            toast.error("Failed to set default bank account");
            console.error("Error setting default bank account:", error);
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

    addBankAccount: async (accountNumber, bankCode, accountName) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(`/bank/add`, { accountNumber, bankCode, accountName });
            console.log("Bank account added:", response.data);
            toast.success("Bank account added successfully!");
            return response.data;
        } catch (error) {
            set({
                error: error?.response?.data?.message || "Failed to add bank account",
            });
            toast.error("Failed to add bank account");
            console.error("Error adding bank account:", error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useBankStore;