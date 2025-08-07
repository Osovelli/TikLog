import useAuthStore from "@/store/authStore";
import { CardComponent } from "../CardComponent";
import { useEffect } from "react";


export const WalletCard = (data) => {
  const {user} = useAuthStore();

  useEffect(() => {
    if (!user) {
      console.error("User data is not available");
    }
    user && console.log("User data:", user);
  }, [user]);

  // Format walletBalance with commas for every three digits
  const formattedWalletBalance = user?.wallet
    ? user?.wallet.toLocaleString("en-US")
    : "0";

    return (
      <CardComponent
        title="Wallet"
        action="Fund wallet"
        content={<p className="text-3xl font-bold mt-2">NGN {formattedWalletBalance}.00</p>}
        className="mb-6"
      />
    );
  };