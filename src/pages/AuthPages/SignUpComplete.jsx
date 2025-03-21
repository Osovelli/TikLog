import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import FormField from '@/components/_AuthComponents/FormField'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, Upload, CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/authStore'
import { format } from "date-fns"
import { useNavigate } from 'react-router'

export const GetToKnowUser = () => {
  const {isProfileComplete, getToKnow, loading} = useAuthStore()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherName: '',
   // dateOfBirth: undefined,
  })
  const [date, setDate] = useState()
  const navigate = useNavigate()

  console.log("DATE",date)

  const [referralCode, setReferralCode] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleChange = (name) => (value) => {
    if (name === 'dateOfBirth') {
      setFormData(prev => ({ ...prev, [name]: format(value, "yyyy-MM-dd") }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!agreeTerms) {
      toast.error('Please accept the terms and conditions')
    }
    console.log({ formData, referralCode })
    // Handle form submission
    await getToKnow({
      firstname: formData.firstName,
      lastname: formData.lastName,
      othername: formData.otherName,
      dob: formData.dateOfBirth,
      isOnboarded: 2,
    }) 

  }

  useEffect(() => {
    if(isProfileComplete){
        navigate("/signup/success")
      }
    },[isProfileComplete]
  )

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setAvatar(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    // Clean up the old preview URL
    return () => URL.revokeObjectURL(previewUrl)
  }
 

  return (
    <>
    <AuthLayout 
    title="Let's get to know you?"
    description="Let's get to know you?"
    >
         {/* Avatar Upload */}
         <div className="flex justify-start">
          <div 
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity group"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview || "/placeholder.svg"}
                alt="Avatar preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-sm">
            <FormField
                name="firstName"
                required
                placeholder="First name"
                className="shadow-sm border"
                value={formData.firstName}
                onChange={handleChange('firstName')}
            />
            <FormField
                label=""
                name="lastName"
                required
                placeholder="Last name"
                className="shadow-sm border"
                value={formData.lastName}
                onChange={handleChange('lastName')}
            />
            <FormField
                label=""
                name="otherName"
                required
                placeholder="Other name"
                className="shadow-sm border"
                value={formData.otherName}
                onChange={handleChange('otherName')}
            />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                  onSelect={(date) => handleChange('dateOfBirth')(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
            <FormField
            label=""
            name="dateOfBirth"
            type="date"
            placeholder='Date of birth*'
            className="shadow-sm border"
            required
            value={date}
            onChange={setDate}
            />
            <FormField
                label=""
                name="referralCode"
                placeholder="Referral code (if any)"
                className="shadow-sm border"
                value={referralCode}
                onChange={(value) => setReferralCode(value)}
            />
            <FormField
                label="I agree to the terms and conditions"
                name="agreeTerms"
                type="checkbox"
                value={agreeTerms}
                onChange={()=>{setAgreeTerms(!agreeTerms)}}
            />
            <ButtonComponent 
            variant='primary' 
            label='Submit'
            buttonStyles='w-full' 
            disabled={!agreeTerms || loading}
            />
        </form>
    </AuthLayout>
    </>
  )
}