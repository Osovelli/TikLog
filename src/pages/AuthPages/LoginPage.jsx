import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppleIcon, EyeIcon, EyeOffIcon,  } from 'lucide-react'
import CustomInput from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { Apple, Google } from '@/icon/Icons'
import InputComponent from '@/components/InputComponent'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'


export const LoginPage = () => {
  const { login, loading, isLoggedIn } = useAuthStore();
  const [formData, setFormData] = useState({
     /*  email: '', */
      phoneNumber: '',
      countryCode: '+234',
      password: '',
    });  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    //if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    /* if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } */
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* const handlePhoneChange = (phoneData) => {
    console.log(phoneData); // { countryCode: '+234', nationalNumber: '8012345678', fullNumber: '+2348012345678' }
  }; */

  const handlePhoneChange = ({ phoneNumber, countryCode }) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber,
      countryCode
    }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlepasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log({email: formData.phoneNumber, password: formData.password})
    login({
      phone_number: formData.phoneNumber,
      password: formData.password
    })

  }  

  useEffect(() => {
    if(isLoggedIn){
      //toast.success("Signup successful");
      navigate("/")
    }
    },[isLoggedIn]
  )


  return (
   <>
   <AuthLayout
    title="Welcome Back!"
    description="Enter your phone number to continue"
    >
      <div className='flex flex-col gap-3'>
         {/* <InputComponent 
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          placeholder="Email address"
          type="email"
        /> */}

        {/* <PhoneInput /> */}
        <PhoneInput
        value={formData.phoneNumber}
        placeholder={"Phone number"}
        type="phone"
        onChange={handlePhoneChange}
        error={errors.phoneNumber}
        defaultCountryCode={formData.countryCode}
        />
        <InputComponent 
        password={true}
        value={formData.password} 
        type={showPassword ? "text" : "password"} 
        placeholder="Password" 
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        disabled={loading} 
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
        </div>
        <Link to={"/forgot-password"}>
          <span className="text-sm text-[#3B3B8F] hover:underline">
            Forgot password?
          </span>
        </Link>
      </div>
      <div className="text-center text-gray-500">or</div>
      <div className='w-full space-y-2'>
        <ButtonComponent 
          buttonStyles='h-[52px] w-full bg-white border-2 hover:bg-transparent' 
          icon={<Google />}>
        </ButtonComponent>
        <ButtonComponent 
          buttonStyles='h-[52px] w-full bg-white border-2 text-sm font-medium text-black hover:bg-transparent' 
          icon={<Apple />} 
          label="Sign in with Apple">
        </ButtonComponent>
      </div>
      <ButtonComponent
      label="Login"
      variant="primary"
      buttonStyles="h-[52px] w-full"
      onClick={handleSignIn}
       />
      <div className="px-8 py-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          New to Tiklog? <Link to={"/signup"} className="text-[#3B3B8F] hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
   </>
  );
}