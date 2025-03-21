import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

const useAddressStore = create((set) => ({
  userAddress: null,
  loading: false,
  error: null,
  showErrorModal: false,

  postAddress: async ({street, city, state, postal_code, longitude, latitude }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/address', { street, city, state, postal_code, longitude, latitude });
      toast.success("Address added successfully");
      console.log("ADDRESS RESPONSE", response)
      /* const address = response.data?.data;
      set({ address: address, loading: false}); */
    } catch (error) {
      console.error("Address upload error", error);
      const errorMessage = error.response?.data?.message || "Failed to post address. Please try again.";
      toast.error(errorMessage)
      set({ loading: false, error: 'Address upload failed, Check the fields!', showErrorModal: true });
    }
  },
  getAddress: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/address');
      toast.success("Address fetched successfully");
      console.log("ADDRESS RESPONSE", response)
      const address = response.data?.data;
      set({ userAddress: address, loading: false});
    } catch (error) {
      console.error("Address upload error", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch address. Please try again.";
      toast.error(errorMessage)
      set({ loading: false, error: 'Address fetch failed', showErrorModal: true });
    }
  },
  updateUserAddress: async ({ id, addressData }) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/address/${id}`, addressData);
      toast.success("Address updated successfully");
      console.log("ADDRESS UPDATE RESPONSE", response);
      const address = response.data?.data;
      set({ userAddress: address, loading: false });
    } catch (error) {
      console.error("Address upload error", error);
      const errorMessage = error.response?.data?.message || "Failed to update address. Please try again.";
      toast.error(errorMessage);
      set({ loading: false, error: 'Address update failed', showErrorModal: true });
    }
  },
  closeErrorModal: () => set({ showErrorModal: false, error: null }),
}));

export default useAddressStore;