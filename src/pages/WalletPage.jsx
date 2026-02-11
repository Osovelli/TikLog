import { AppLayout } from "@/components/AppLayout"
import { ButtonComponent } from "@/components/ButtonComponent"
import { CardComponent } from "@/components/CardComponent"
import { FundWalletForm } from "@/components/_WalletComponents/FundWalletForm"
import SideSheet from "@/components/SheetComponent"
import { Table } from "@/components/Table"
import { AmountForm, TransferForm } from "@/components/_WalletComponents/TransferFlowModal"
import { useModal } from "@/lib/ModalContext"
import { PaymentMethodItem } from "@/lib/PaymentMethodHelper"
import { ArrowUpRightIcon, Wallet2Icon, WalletIcon, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import useAuthStore from "@/store/authStore"
import toast from "react-hot-toast"
import { FaMoneyBill } from "react-icons/fa"
import useWalletStore from "@/store/walletStore"
import { 
  WithdrawMethodModal,
  SelectBankModal,
  AddBankModal,
  WithdrawalDetailsForm
} from "@/components/_WalletComponents/WithdrawalFlowModal"
import useBankStore from "@/store/bankStore"
import { ArrowDownLeftIcon } from "lucide-react"

const paymentMethods = [
  {
    type: "visa",
    number: "9235",
    expiryDate: "09/28",
  },
  {
    type: "mastercard",
    number: "9235",
    expiryDate: "09/28",
  },
]

const content = (
  <div className="space-y-1">
    <p className="text-sm">Connected Payment methods</p>
    {paymentMethods.map((method, index) => (
      <PaymentMethodItem key={index} type={method.type} number={method.number} expiryDate={method.expiryDate} />
    ))}
  </div>
)

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
]

export const WalletPage = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  //const { createDeposit, verifyDeposit } = useWalletStore()
  const [savedBanks, setSavedBanks] = useState([])
  const { openModal, closeModal } = useModal()
  const { getMe, loading } = useAuthStore() 
  const { getWalletHistory, walletHistory, getUserWalletDetails, walletDetails, loading: walletLoading, error } = useWalletStore()
  const { getBanks, banks, getBankById, loading: bankLoading } = useBankStore()

  const walletBalance = walletDetails?.balance || 0

  /* useEffect(() => {
    getMe()
  }, [getMe])

  console.log("WALLET DETAILS", walletDetails) */

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      await getBanks()
    }
    fetchBanks()
  }, [])

  // Update saved banks when wallet details change
  useEffect(() => {
    if (walletDetails?.bankAccounts) {
      setSavedBanks(walletDetails.bankAccounts)
    }
  }, [walletDetails])

  // Fetch wallet history on component mount
  useEffect(() => {
    //getWalletHistory()
    getUserWalletDetails()
  }, [getUserWalletDetails])

  console.log("WALLET DETAILS", walletDetails)

  useEffect(() => {
    if (walletDetails?.balance == 0) {
      toast.error("Please fund your wallet to continue using our services", {
        icon: <FaMoneyBill size={24} />,
        duration: 5000,
        className: "p-4 text-sm text-red-600",
      })
    }
  }, [])

  // Transform wallet history data to match table structure
  const transformedTransactionData =
    walletDetails?.transactions?.map((transaction) => {
      // Format date
      const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }

      // Format transaction type
      const formatTransactionType = (type) => {
        switch (type?.toLowerCase()) {
          case "deposit":
            return "Wallet deposit"
          case "withdrawal":
            return "Withdrawal"
          case "transfer":
            return "Transfer to"
          case "delivery":
            return "Tiklog Delivery"
          default:
            return type || "Transaction"
        }
      }

      // Format amount
      const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
      }

      // Format status
      const formatStatus = (status) => {
        return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || "Pending"
      }

      return {
        id: transaction.reference || transaction._id,
        type: formatTransactionType(transaction.type),
        amount: formatAmount(transaction.amount),
        date: formatDate(transaction.transaction_date || transaction.createdAt),
        status: formatStatus(transaction.status),
        // Keep original data for details view
        originalData: transaction,
      }
    }) || []

  // Handler for row clicks
  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenSideMenu(true)
  }

  // Handler for closing the side sheet
  const handleCloseSideSheet = () => {
    setOpenSideMenu(false)
    setSelectedTransaction(null)
  }

  // Custom cell renderer for status
  const renderCustomCell = (key, value, item) => {
    if (key === "status") {
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case "completed":
          case "success":
            return "bg-green-100 text-green-800"
          case "pending":
            return "bg-yellow-100 text-yellow-800"
          case "failed":
          case "cancelled":
            return "bg-red-100 text-red-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      }

      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>{value}</span>
    }

    if (key === "amount") {
      return <span className="font-medium">₦{value}</span>
    }

    return value
  }

  // Transaction details component for the side sheet
  const TransactionDetails = ({ transaction }) => {
    if (!transaction) return null

    const originalData = transaction.originalData

    // Helper function to format the amount
    const formatAmount = (amount) => {
      return new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    }

    // Format full date
    const formatFullDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return (
      <div className="space-y-8">
        {/* Amount and Transaction Type Section */}
        <div className="text-center space-y-2 pb-8 border-b">
          <div className="text-4xl font-semibold">
            <span className="text-gray-500">₦</span>
            <span>{formatAmount(originalData.amount)}</span>
          </div>
          <div className="text-gray-600">
            {transaction.type} <span className="text-blue-500">#{transaction.id}</span>
          </div>
        </div>

        {/* Transaction Details Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            <span
              className={`font-medium ${
                originalData.status?.toLowerCase() === "completed"
                  ? "text-green-500"
                  : originalData.status?.toLowerCase() === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {originalData.status || "Pending"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-medium">#{transaction.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Reference</span>
            <span className="font-medium">{originalData.reference || "N/A"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Transaction type</span>
            <span className="font-medium">{transaction.type}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">
              {formatFullDate(originalData.transaction_date || originalData.createdAt)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Amount</span>
            <span className="text-blue-500 font-medium">₦ {formatAmount(originalData.amount)}</span>
          </div>

          {originalData.updatedAt && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium">{formatFullDate(originalData.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* const handleTransferModal = useCallback(() => {
    // Mock user data (replace with API call later)
    const mockUserLookup = (phone) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "John Doe Samuel",
            phoneNumber: phone,
          })
        }, 500)
      })
    }

    const handleContinue = async (phoneNumber) => {
      const userData = await mockUserLookup(phoneNumber)
      closeModal()

      const handleConfirm = (amount) => {
        console.log("Transfer confirmed", { amount, userData })
        openModal({
          title: "Transfer completed Successfully",
          icon: <img src="Illustration.png" />,
          content: (
            <div>
              <p className="text-sm">
                Your transfer to <span className="text-blue-300">John Doe Samuel</span>(0810000000) was completed
                successfully.
              </p>
            </div>
          ),
          buttons: [
            {
              label: "Continue",
              primary: true,
              onClick: closeModal(),
            },
          ],
        })
      }

      openModal({
        title: "Transfer to others",
        content: <AmountForm userData={userData} onConfirm={handleConfirm} />,
      })
    }

    setOpenSideMenu(false)
    openModal({
      title: "Transfer to others",
      content: <TransferForm onContinue={handleContinue} />,
    })
  }, [openModal, closeModal]) */

const handleTransferModal = useCallback(() => {
  const { validateTransferPhoneNumber, transferToUser } = useWalletStore.getState()

  const handleContinue = async (phone, ownerType) => {
    // Debug log to verify values
    console.log("handleContinue called with:", { phone, ownerType })
    
    if (!phone) {
      toast.error("Phone number is required")
      return
    }

    try {
      // Validate phone number using store method
      const response = await validateTransferPhoneNumber(phone, ownerType)
      
      console.log("Validation response:", response)
      
      if (!response?.data) {
        return // Error toast is shown in store
      }

      const userData = {
        name: response.data.name || response.data.fullName || response.data.firstName || "User",
        phone: phone,
        ownerType: ownerType,
        ...response.data
      }

      closeModal()

      // Open amount form modal
      const handleConfirm = async (amount, description = "") => {
        try {
          const transferResponse = await transferToUser(
            parseFloat(amount),
            description || `Transfer to ${userData.name}`,
            ownerType,
            phone  // Using phone instead of phoneNumber
          )

          if (transferResponse) {
            closeModal()
            
            // Refresh wallet data
            await getMe()
            //await getWalletHistory()
            await getUserWalletDetails()

            // Show success modal
            openModal({
              title: "Transfer Successful",
              icon: <img src="/Illustration.png" alt="Success" className="w-24 h-24 mx-auto" />,
              content: (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Your transfer of{" "}
                    <span className="text-blue-600 font-semibold">
                      ₦{parseInt(amount).toLocaleString()}
                    </span>{" "}
                    to{" "}
                    <span className="text-blue-600 font-semibold">{userData.name}</span>
                    {" "}({phone}) was completed successfully.
                  </p>
                </div>
              ),
              buttons: [
                {
                  label: "Continue",
                  primary: true,
                  onClick: closeModal,
                },
              ],
            })
          }
        } catch (error) {
          console.error("Transfer failed:", error)
        }
      }

      openModal({
        title: "Transfer to others",
        content: <AmountForm userData={userData} onConfirm={handleConfirm} onCancel={closeModal} />,
      })

    } catch (error) {
      console.error("Phone validation failed:", error)
    }
  }

  setOpenSideMenu(false)
  openModal({
    title: "Transfer to others",
    content: <TransferForm onContinue={handleContinue} onCancel={closeModal} />,
  })
}, [openModal, closeModal, getMe, getUserWalletDetails])


  /* const handleFundWalletModal = useCallback(() => {
    const handleContinue = (amount) => {
      // Here you would integrate with Paystack
      console.log("Processing payment for:", amount)

      // After successful payment, show success modal
      openModal({
        title: "Payment Successful",
        icon: <img src="Illustration.png" alt="Success" />,
        content: (
          <div>
            <p className="text-sm">
              Your wallet has been funded with <span className="text-blue-300">₦{amount}</span> successfully.
            </p>
          </div>
        ),
        buttons: [
          {
            label: "Continue",
            primary: true,
            onClick: closeModal,
          },
        ],
      })
    }

    openModal({
      title: "Fund wallet",
      content: (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Kindly input the amount you'd like to fund your wallet with, you'll be redirected to paystack to complete
            your transaction.
          </p>
          <FundWalletForm onContinue={handleContinue} />
        </div>
      ),
    })
  }, [openModal, closeModal]) */

  const handleFundWalletModal = useCallback(() => {
    const handleSuccess = async (amount) => {
      closeModal()
    
      // Refresh wallet data
      await getMe()
      await getUserWalletDetails()
      //await getWalletHistory()
    
      // Show success modal
      openModal({
        title: "Payment Successful",
        icon: <img src="/Illustration.png" alt="Success" className="w-24 h-24 mx-auto" />,
        content: (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your wallet has been funded with{" "}
              <span className="text-blue-600 font-semibold">
                ₦{parseInt(amount).toLocaleString()}
              </span>{" "}
              successfully.
            </p>
          </div>
        ),
        buttons: [
          {
            label: "Continue",
            primary: true,
            onClick: closeModal,
          },
        ],
      })
    }

    openModal({
      title: "Fund Wallet",
      content: (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Enter the amount you'd like to fund your wallet with. You'll be redirected to Paystack to complete your transaction.
          </p>
          <FundWalletForm onSuccess={handleSuccess} onClose={closeModal} />
        </div>
      ),
    })
}, [openModal, closeModal, getMe, getUserWalletDetails])


const handleWithdrawModal = useCallback(() => {
  const { createWithdrawalOtp, verifyWithdrawal, getUserWalletDetails } = useWalletStore.getState()
  const { getBankById } = useBankStore.getState()

  let selectedBank = null

  // Step 1: Choose withdrawal method
  const showMethodSelection = () => {
    openModal({
      title: "Withdraw Funds",
      content: (
        <WithdrawMethodModal
          onSelectMethod={(method) => {
            if (method === "bank") {
              closeModal()
              showBankSelection()
            } else {
              toast.info("PayPal withdrawals coming soon!")
            }
          }}
          onCancel={closeModal}
        />
      ),
    })
  }

  // Step 2: Select bank account
  const showBankSelection = () => {
    openModal({
      title: "Select Bank Account",
      content: (
        <SelectBankModal
          savedBanks={walletDetails?.bankAccounts || []}
          loading={bankLoading}
          onSelectBank={async (bank) => {
            try {
              // Fetch full bank details
              const bankDetails = await getBankById(bank._id || bank.id)
              selectedBank = bankDetails?.data || bank
              closeModal()
              showWithdrawalForm()
            } catch (error) {
              console.error("Failed to get bank details:", error)
              selectedBank = bank
              closeModal()
              showWithdrawalForm()
            }
          }}
          onAddBank={() => {
            closeModal()
            showAddBank()
          }}
          onCancel={closeModal}
        />
      ),
    })
  }

  // Step 3: Add new bank
  const showAddBank = () => {
    openModal({
      title: "Add Bank Account",
      content: (
        <AddBankModal
          onSuccess={async () => {
            closeModal()
            // Refresh wallet details to get updated bank list
            await getUserWalletDetails()
            showBankSelection()
          }}
          onCancel={() => {
            closeModal()
            showBankSelection()
          }}
        />
      ),
    })
  }

  // Step 4: Withdrawal form
  const showWithdrawalForm = () => {
    if (!selectedBank) {
      toast.error("Please select a bank account")
      showBankSelection()
      return
    }

    openModal({
      title: "Withdraw Funds",
      content: (
        <WithdrawalDetailsForm
          selectedBank={selectedBank}
          onSubmit={async (amount, bank) => {
            closeModal()
            
            // Refresh wallet data
            await getMe()
            await getUserWalletDetails()

            // Show success modal
            openModal({
              title: "Withdrawal Successful",
              icon: <img src="/Illustration.png" alt="Success" className="w-24 h-24 mx-auto" />,
              content: (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Your withdrawal of{" "}
                    <span className="text-blue-600 font-semibold">
                      ₦{parseInt(amount).toLocaleString()}
                    </span>{" "}
                    to{" "}
                    <span className="text-blue-600 font-semibold">{bank.bankName}</span>
                    {" "}(****{bank.accountNumber?.slice(-4)}) has been initiated successfully.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    You will receive your funds within 24 hours.
                  </p>
                </div>
              ),
              buttons: [
                {
                  label: "Continue",
                  primary: true,
                  onClick: closeModal,
                },
              ],
            })
          }}
          onBack={() => {
            closeModal()
            showBankSelection()
          }}
          onCancel={closeModal}
        />
      ),
    })
  }

  // Start the flow
  showMethodSelection()
}, [openModal, closeModal, getMe, walletDetails, bankLoading])

  // Loading state
  if (walletLoading) {
    return (
      <AppLayout title={"Wallet"} icon={<WalletIcon />}>
        <div className="p-6 space-y-2">
          <div className="flex flex-col md:flex-row gap-3">
            <CardComponent
              title="Wallet balance"
              subtitle={walletLoading ? "Loading..." : `₦${walletDetails?.balance}.00`}
              variant="blue"
              content={
                <div className="flex space-x-2 p-1 w-full mt-16">
                  <ButtonComponent
                    onClick={handleFundWalletModal}
                    buttonStyles="sm:w-72"
                    label={"Add fund"}
                    icon={<Wallet2Icon size={18} />}
                    variant="primary"
                  />
                  <ButtonComponent
                    onClick={handleTransferModal}
                    buttonStyles="sm:w-72"
                    label={"Transfer to others"}
                    icon={<ArrowUpRightIcon size={18} />}
                    variant="primary"
                  />
                </div>
              }
              className="flex-1"
            />
            <CardComponent title="Payment Methods" content={content} className="flex-1" />
          </div>
          <div className="p-4 border space-y-2 shadow-sm">
            <p className="text-base font-medium">Transactions</p>
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading transactions...</span>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout title={"Wallet"} icon={<WalletIcon />}>
        <div className="p-6 space-y-2">
          <div className="flex flex-col xl:flex-row gap-3">
            <CardComponent
              title="Wallet balance"
              subtitle={loading ? "Error" : `${walletDetails?.currency} ${walletDetails?.balance.toLocaleString("en-US")}`}
              variant="blue"
              content={
                <div className="flex flex-col lg:flex-row gap-2 space-x-2 p-1 w-full mt-16 flex-wrap lg:flex-nowrap items-center justify-start">
                  <ButtonComponent
                    onClick={handleFundWalletModal}
                    buttonStyles="sm:w-72"
                    label={"Add fund"}
                    icon={<Wallet2Icon size={18} />}
                    variant="primary"
                  />
                  <ButtonComponent
                    onClick={handleTransferModal}
                    buttonStyles="sm:w-72"
                    label={"Transfer to others"}
                    icon={<ArrowUpRightIcon size={18} />}
                    variant="primary"
                  />
                </div>
              }
              className="flex-1"
            />
            <CardComponent title="Payment Methods" content={content} className="flex-1" />
          </div>
          <div className="p-4 border space-y-2 shadow-sm">
            <p className="text-base font-medium">Transactions</p>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load transactions</p>
              <ButtonComponent label="Retry" onClick={() => getUserWalletDetails()} variant="primary" />
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={"Wallet"} icon={<WalletIcon />}>
      <div className="p-6 space-y-2">
        <div className="flex flex-col xl:flex-row gap-3">
          <CardComponent
            title="Wallet balance"
            subtitle={walletBalance ? `₦${walletBalance.toLocaleString("en-US")}` : "₦0.00"}
            variant="blue"
            content={
              <div className="flex flex-wrap gap-2 p-1 w-full mt-16">
                <ButtonComponent
                  onClick={handleFundWalletModal}
                  buttonStyles="flex-1 min-w-[120px]"
                  label={"Add fund"}
                  icon={<Wallet2Icon size={18} />}
                  variant="primary"
                />
                <ButtonComponent
                  onClick={handleWithdrawModal}
                  buttonStyles="flex-1 min-w-[120px]"
                  label={"Withdraw"}
                  icon={<ArrowDownLeftIcon size={18} />}
                  variant="primary"
                />
                <ButtonComponent
                  onClick={handleTransferModal}
                  buttonStyles="flex-1 min-w-[120px]"
                  label={"Transfer"}
                  icon={<ArrowUpRightIcon size={18} />}
                  variant="primary"
                />
              </div>
            }
            className="flex-1"
          />
          <CardComponent title="Payment Methods" content={content} className="flex-1" />
        </div>
        <div className="p-4 border space-y-2 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium">Transactions</p>
            <span className="text-sm text-gray-500">
              {transformedTransactionData.length} transaction{transformedTransactionData.length !== 1 ? "s" : ""}
            </span>
          </div>

          {transformedTransactionData.length === 0 ? (
            <div className="text-center py-8">
              <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No transactions yet</p>
              <p className="text-sm text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={transformedTransactionData}
              onRowClick={handleRowClick}
              renderCustomCell={renderCustomCell}
            />
          )}
        </div>
        {/* Side Sheet for Transaction Details */}
        <SideSheet isOpen={openSideMenu} onClose={handleCloseSideSheet} title="Transaction Details">
          <TransactionDetails transaction={selectedTransaction} />
        </SideSheet>
      </div>
    </AppLayout>
  )
}
