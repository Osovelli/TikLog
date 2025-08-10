import { create } from "zustand"
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useReferralStore = create((set, get) => ({
  referralCode: null,
  referralStats: null,
  loading: false,
  error: null,


   getReferralStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get(`/referral/stats`);
            console.log("Referral Stats fetched:", response.data.data);
            //toast.success("Referral fetched successfully!");
            set({ 
              loading: false, 
              referralStats: response?.data?.data?.referrals?.referralStats, 
              referralCode: response?.data?.data?.referrals?.referralCode
            });
            return response.data;
        } catch (error) {
            set({
                loading: false,
                error: error?.response?.data?.message || "Failed to fetch referral stats",
                showErrorModal: true
            });
            //toast.error("Failed to fetch notifications");
            console.error("Error fetching referral Stats:", error)
            return null;
        }
        finally {
            set({ loading: false });
        }
    },

  /* getReferralCode: async () => {
    set({ loading: true, error: null })
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/referral/code", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch referral code")
      }

      const data = await response.json()
      set({
        referralCode: data.referralCode || "TIKLOG2024",
        loading: false,
      })
    } catch (error) {
      console.error("Error fetching referral code:", error)
      set({
        error: error.message,
        loading: false,
        // Fallback referral code for demo
        referralCode: "TIKLOG2024",
      })
    }
  },

  getReferralStats: async () => {
    set({ loading: true, error: null })
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/referral/stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch referral stats")
      }

      const data = await response.json()
      set({
        referralStats: data,
        loading: false,
      })
    } catch (error) {
      console.error("Error fetching referral stats:", error)
      set({
        error: error.message,
        loading: false,
        // Fallback stats for demo
        referralStats: {
          totalCommission: 0,
          totalReferrals: 0,
          pendingReferrals: 0,
          successfulReferrals: 0,
        },
      })
    }
  },

  sendEmailInvitation: async (data) => {
    set({ loading: true, error: null })
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/referral/invite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to send email invitation")
      }

      const result = await response.json()
      set({ loading: false })

      // Optionally refresh stats after successful invitation
      get().getReferralStats()

      return result
    } catch (error) {
      console.error("Error sending email invitation:", error)
      set({
        error: error.message,
        loading: false,
      })
      throw error
    }
  },

  generateNewReferralCode: async () => {
    set({ loading: true, error: null })
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/referral/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate new referral code")
      }

      const data = await response.json()
      set({
        referralCode: data.referralCode,
        loading: false,
      })
    } catch (error) {
      console.error("Error generating referral code:", error)
      set({
        error: error.message,
        loading: false,
      })
    }
  }, */
}))

export default useReferralStore
