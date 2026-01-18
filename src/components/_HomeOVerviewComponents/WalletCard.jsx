import useAuthStore from "@/store/authStore";
import { CardComponent } from "../CardComponent";
import { useEffect } from "react";


export const WalletCard = (data) => {
  const {walletDetails} = useAuthStore();

  console.log("WALLET DETAILS IN WALLET CARD", walletDetails);

  useEffect(() => {
    if (!walletDetails) {
      console.error("Wallet details are not available");
    }
    walletDetails && console.log("Wallet details:", walletDetails);
  }, [walletDetails]);
  // Format walletBalance with commas for every three digits
  const formattedWalletBalance = walletDetails?.balance
    ? walletDetails?.balance.toLocaleString("en-US")
    : "0";

    return (
      <CardComponent
        title="Wallet"
        action="Fund wallet"
        content={<p className="text-3xl font-bold mt-2">{walletDetails?.currency} {formattedWalletBalance}.00</p>}
        className="mb-6"
      />
    );
  };