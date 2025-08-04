import useAuthStore from "@/store/authStore";
import { CardComponent } from "../CardComponent";


export const WalletCard = () => {
  const {user} = useAuthStore();

  const walletBalance = user?.wallet || 0;

    return (
      <CardComponent
        title="Wallet"
        action="Fund wallet"
        content={<p className="text-3xl font-bold mt-2">{`NGN ${walletBalance}.00`}</p>}
        className="mb-6"
      />
    );
  };