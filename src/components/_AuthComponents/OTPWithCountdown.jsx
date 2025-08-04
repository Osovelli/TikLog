import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"

<<<<<<< Updated upstream
export default function OTPWithCountdown({otp, setOtp, handleContinue}) {
=======
<<<<<<< Updated upstream
export default function OTPWithCountdown() {
>>>>>>> Stashed changes
  const [timer, setTimer] = useState(90); // 90 seconds = 1:30
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate()

  /* const handleContinue = () => {
    navigate('/reset-password/success')
  } */

=======
export const OTPWithCountdown = ({otp, setOtp, onOtpChange, onResendOtp, email }) => {
  //const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(300)
  const [canResend, setCanResend] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);

  // Countdown timer effect
>>>>>>> Stashed changes
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Call parent callback with complete OTP
    const otpString = newOtp.join("")
    if (onOtpChange) {
      onOtpChange(otpString)
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Handle resend OTP
  const handleResend = () => {
    if (onResendOtp) {
      onResendOtp()
    }
    setCountdown(90)
    setCanResend(false)
    setOtp("")
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col space-y-4">
      <InputOTP
        value={otp}
        onChange={setOtp}
        maxLength={6}
        disabled={isDisabled}
      >
        <InputOTPGroup className='flex gap-3'>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSeparator className=""/>
          <InputOTPSlot index={2} className='' />
          <InputOTPSlot index={3} className='' />
          <InputOTPSeparator className=""/>
          <InputOTPSlot index={4} className='' />
          <InputOTPSlot index={5} className='' />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center space-x-12 text-sm">
        <button
          onClick={handleResend}
          disabled={!isDisabled}
          className="text-blue-600 disabled:text-gray-400"
        >
          Send code reload in
        </button>
        <span className={isDisabled ? "text-blue-600" : "text-gray-500"}>
          {formatTime(timer)}
        </span>
=======
    <div className="space-y-4">
      {/* <Label className="text-sm font-medium">Enter OTP</Label> */}

      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-2">
        {/* {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        ))} */}
      </div>
      <InputOTP
          value={otp}
          onChange={setOtp}
          maxLength={6}
          disabled={isDisabled}
        >
          <InputOTPGroup className='flex gap-3'>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSeparator className=""/>
            <InputOTPSlot index={2} className='' />
            <InputOTPSlot index={3} className='' />
            <InputOTPSeparator className=""/>
            <InputOTPSlot index={4} className='' />
            <InputOTPSlot index={5} className='' />
          </InputOTPGroup>
        </InputOTP>

      {/* Resend OTP */}
      <div className="text-center">
        {canResend ? (
          <Button type="button" variant="link" onClick={handleResend} className="text-[#1F1F76] hover:text-[#1a1a66]">
            Resend OTP
          </Button>
        ) : (
          <p className="text-sm text-gray-600">Resend OTP in {formatTime(countdown)} seconds</p>
        )}
>>>>>>> Stashed changes
      </div>
    </div>
  )
}
