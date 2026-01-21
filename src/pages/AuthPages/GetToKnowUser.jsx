import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import FormField from '@/components/_AuthComponents/FormField'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '@/store/authStore'
import useUploadStore from '@/store/uploadStore'
import { format } from "date-fns"
import { useNavigate } from 'react-router'

export const GetToKnowUser = () => {
  const { isProfileComplete, getToKnow, loading } = useAuthStore()
  const { uploadFile } = useUploadStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherName: '',
    dateOfBirth: '',
    referralCode: '',
    email: '',
  })
  
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null) // Store uploaded image data
  const [imageUploading, setImageUploading] = useState(false)

  const fileInputRef = useRef(null)

  const handleChange = (name) => (value) => {
    if (name === 'dateOfBirth') {
      setFormData(prev => ({ ...prev, [name]: format(value, "yyyy-MM-dd") }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // Prepare the payload
      const payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        othername: formData.otherName || '',
        email: formData.email || '',
        dob: formData.dateOfBirth,
        referralCode: formData.referralCode || '',
      }

      // Add profile image if uploaded
      if (uploadedImage) {
        payload.profileImage = {
          url: uploadedImage.url,
          publicId: uploadedImage.publicId,
        }
      }

      console.log('Submitting payload:', payload)
      
      await getToKnow(payload)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  useEffect(() => {
    if (isProfileComplete) {
      navigate("/signup/success")
    }
  }, [isProfileComplete, navigate])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
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

    try {
      setImageUploading(true)
      
      // Set avatar for display
      setAvatar(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      // Upload the image to get URL and publicId
      const uploadedData = await uploadFile(file, "user/profile_image")
      
      if (uploadedData) {
        console.log('Uploaded data:', uploadedData)
        setUploadedImage({
          url: uploadedData.url,
          publicId: uploadedData.publicId,
        })
        toast.success('Profile picture uploaded successfully!')
        console.log('Uploaded image data:', uploadedData)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
      // Clear the preview on error
      setAvatarPreview(null)
      setAvatar(null)
      setUploadedImage(null)
    } finally {
      setImageUploading(false)
    }
  }

  return (
    <>
      <AuthLayout 
        title="Let's get to know you?"
        description="Complete your profile to get started"
      >
        {/* Avatar Upload */}
        <div className="flex justify-start mb-6">
          <div 
            onClick={!imageUploading ? handleAvatarClick : undefined}
            className={`relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center ${
              imageUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-90'
            } transition-opacity group`}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
            
            {imageUploading ? (
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={imageUploading}
            />
          </div>
          
          {/* Upload status indicator */}
          {uploadedImage && (
            <div className="ml-4 flex items-center text-sm text-green-600">
              <svg 
                className="w-5 h-5 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              Image uploaded
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-sm space-y-4">
          <FormField
            name="firstName"
            required
            placeholder="First name*"
            className="shadow-sm border"
            value={formData.firstName}
            onChange={handleChange('firstName')}
          />
          
          <FormField
            label=""
            name="lastName"
            required
            placeholder="Last name*"
            className="shadow-sm border"
            value={formData.lastName}
            onChange={handleChange('lastName')}
          />
          
          <FormField
            label=""
            name="otherName"
            placeholder="Other name"
            className="shadow-sm border"
            value={formData.otherName}
            onChange={handleChange('otherName')}
          />
          
          <FormField
            label=""
            name="dateOfBirth"
            type="date"
            placeholder="Date of birth*"
            className="shadow-sm border"
            required
            value={formData.dateOfBirth}
            onChange={handleChange('dateOfBirth')}
          />
          
          <FormField
            label=""
            name="email"
            type="email"
            placeholder="Email"
            className="shadow-sm border"
            value={formData.email}
            onChange={handleChange('email')}
          />
          
          <FormField
            label=""
            name="referralCode"
            placeholder="Referral code (if any)"
            className="shadow-sm border"
            value={formData.referralCode}
            onChange={handleChange('referralCode')}
          />
          
          <FormField
            label="I agree to the terms and conditions"
            name="agreeTerms"
            type="checkbox"
            value={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
          />
          
          <ButtonComponent 
            variant="primary" 
            label={loading ? 'Submitting...' : 'Submit'}
            buttonStyles="w-full" 
            disabled={!agreeTerms || loading || imageUploading}
          />
          
          {imageUploading && (
            <p className="text-sm text-center text-muted-foreground">
              Please wait while we upload your profile picture...
            </p>
          )}
        </form>
      </AuthLayout>
    </>
  )
}