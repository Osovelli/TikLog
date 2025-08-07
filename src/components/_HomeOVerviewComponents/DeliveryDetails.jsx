export const DeliveryDetails = ({data}) => (
<>
<h2 className="text-xl font-semibold mb-4">Delivery amount</h2>
      <p className="text-2xl font-bold mb-4">NGN {data.delivery_amount.toLocaleString('en-US')}</p>
      <div className="text-left space-y-2 mb-4 p-2 rounded-md bg-[#F6F8FA]">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
          <span className="font-semibold">Pickup location</span>
        </div>
        <p className="ml-5">{data.from_address}</p>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="font-semibold">Delivery location</span>
        </div>
        <p className="ml-5">{data.to_address}</p>
      </div>
</>
  );