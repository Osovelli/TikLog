import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Camera, Copy, Edit, Loader2, MapPin, PencilIcon, Trash2, Upload } from 'lucide-react';
import CountryCodeSelect from '../GetCountryCode';
import { ButtonComponent } from '../ButtonComponent';
import { useModal } from '@/lib/ModalContext';
import AddressForm from './AddressForm';
import useAuthStore from '@/store/authStore';
import Autocomplete from "react-google-autocomplete";
import getCoordinatesFromAddress from './GetCordinatesFromAddress';
import toast from 'react-hot-toast';
import useAddressStore from '@/store/addressStore';
import useUploadStore from '@/store/uploadStore';
import DatePickerComponent from '../DatePickerComponent';


const GOOGLE_MAPS_APIKEY = 'AIzaSyCIgMXmltDX6vNpGWxAR0_egUzH4sk8aHk'

const nationality = [
  'Nigeria',
  'Ghana',
  'South Africa',
  'United States',
];
  

function ProfileHeader({ data, onUploadClick, avatarPreview, imageUploading }) {
    const {loading} = useAuthStore()
    const fileInputRef = useRef(null);

    console.log("Profile Header Data:", data);

    const handleUploadClick = (e) => {
      e.preventDefault();
      if (!imageUploading) {
        fileInputRef.current.click();
      }
    };

    return (
      <div className="relative">
        <div className="h-48 w-full bg-sky-100 relative">
          <img
            src="Image-wrap.png"
            alt="Profile banner"
            className="w-full h-full sm:object-contain object-fill"
          />
        </div>
        <div className="absolute bottom-12 left-8 transform translate-y-1/2">
          {/* Avatar Upload */}
          <div className="flex justify-start mb-6">
            <div 
              className={`relative w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-white ${
                imageUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
              } transition-opacity group overflow-hidden`}
            >
              {/* Display preview if available, otherwise show user's profile picture, otherwise show camera icon */}
              {avatarPreview || data?.profileImage?.url ? (
                <img
                  src={avatarPreview || data?.profileImage?.url}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
              
              {/* Loading spinner during upload */}
              {imageUploading ? (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                /* Camera icon on hover - clicking this opens file input */
                <div 
                  onClick={handleUploadClick}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onUploadClick}
                className="hidden"
                disabled={imageUploading}
              />
            </div>
          </div>
        </div>
        <div className="ml-48 pt-4">
          <h1 className="text-2xl font-semibold capitalize">
            {loading ? "" : `${data?.firstname} ${data?.lastname}`}
          </h1>
          <p className="text-gray-500">{data?.email}</p>
        </div>
      </div>
    );
}

  
  function PersonalInfo({ uploadedImageData, onImageSaved }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    othername: "",
    nationality: '',
    image: '',
    email: '',
    phone: '',
    date: '',
    profilePicture: null,
  });

  const { updateUser, loading } = useAuthStore()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async () => {
    try {
      // Build the update payload
      const updatePayload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        othername: formData.othername,
        dob: formData.date,
        nationality: formData.nationality,
        phone: formData.phone,
        email: formData.email,
      }

      // Conditionally add profile image if one was uploaded
      if (uploadedImageData) {
        updatePayload.profileImage = {
          url: uploadedImageData.url,
          publicId: uploadedImageData.publicId,
        }
      }

      // Check if there's anything to update
      const hasFormChanges = Object.values(formData).some(value => value !== '' && value !== null)
      const hasImageChanges = !!uploadedImageData

      if (!hasFormChanges && !hasImageChanges) {
        toast.info('No changes to save.')
        return
      }

      await updateUser(updatePayload)
      
      //toast.success('Profile updated successfully!')
      
      // Clear the uploaded image data in parent component
      if (uploadedImageData && onImageSaved) {
        onImageSaved()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  return (
    <div className="mt-8 mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
      <div className="">
        <h2 className="text-lg font-semibold">Personal info</h2>
        <p className="text-gray-500 mb-6">Update your photo and personal details.</p>
      </div>

      <div className="space-y-4 w-full md:w-1/2">
        <div className="relative">
          <Input
            name="firstname"
            value={formData.firstname}
            placeholder="Enter firstname"
            onChange={handleInputChange}
            className="h-12 mb-4"
          />
          <Input
            name="lastname"
            value={formData.lastname}
            placeholder="Enter lastname"
            onChange={handleInputChange}
            className="h-12 mb-4"
          />
          <Input
            name="othername"
            value={formData.othername}
            placeholder="Enter othername"
            onChange={handleInputChange}
            className="h-12 mb-4"
          />

          <Select
            onValueChange={(value) => setFormData({ ...formData, nationality: value })}
          >
            <SelectTrigger className="h-12 w-full mb-4 text-gray-500">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationality.map((item, index) => (
                <SelectItem key={index} value={item}>{item}</SelectItem>
              ))} 
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 h-8">
          <CountryCodeSelect />
          <div className="relative flex-1">
            <Input
              name="phone"
              placeholder="08000000000"
              value={formData.phone}
              onChange={handleInputChange}
              className=""
            />
          </div>
        </div>

        <div className="relative">
          {/* <Popover>
            <PopoverTrigger asChild>
              <div className="h-12 w-full rounded border px-3 flex items-center justify-between cursor-pointer text-sm text-gray-500">
                {formData.date ? format(formData.date, 'dd - MM - yyyy') : 'Enter date of birth'}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover> */}
          <DatePickerComponent
            label=""
            value={formData.date}
            onChange={handleDateChange}
            placeholder="Select your date of birth"
            minAge={15}
            maxAge={100}
            showPresets={false}  // Toggle preset buttons
          />
        </div>

        <div className="relative">
          <Input
            name="address"
            value={formData.address}
            placeholder="Enter address"
            onChange={handleInputChange}
            className="h-12"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="flex justify-end">
          <ButtonComponent 
            label={loading ? 'Saving...' : 'Save Changes'} 
            variant={'primary'} 
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
  
  function AddressSection() {
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const {openModal, closeModal} = useModal()
    const {postAddress, getAddress, userAddress, updateUserAddress} = useAddressStore()

    const handleMapSubmit = async (address) => {
      const apiKey = GOOGLE_MAPS_APIKEY;
      
      // Fallback coordinates for Lagos, Nigeria (for testing without valid API key)
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === '') {
        return {
          latitude: 6.5244,
          longitude: 3.3792
        };
      }
      
      const coords = await getCoordinatesFromAddress(address, apiKey);
  
      if (coords) {
        return coords;
      } else {
        // Use fallback if API fails
        toast.error("Using default Lagos coordinates for testing.");
        return {
          latitude: 6.5244,
          longitude: 3.3792
        };
      }
    };

    const handleAddNewAddress = () => {
      // Local state for the modal form
      let modalAddress = '';
      let modalCity = '';
      let modalState = '';
      let modalPostalCode = '';
      let modalCountry = 'Nigeria';
      let modalAddressType = 'home';
      let modalIsPrimary = false;
      let modalCoordinates = { latitude: null, longitude: null };
      
      openModal({
        title: "New Address",
        content: (
          <>
          <Autocomplete
            apiKey={GOOGLE_MAPS_APIKEY}
            style={{ 
              width: "100%", 
              height: 48, 
              borderWidth: 1, 
              borderColor: '#f1f1f1', 
              backgroundColor: '#f9fafb', 
              borderRadius: 7, 
              paddingLeft: 10, 
              marginBottom: '20px', 
              fontSize: '14px', 
              color: '#111827' 
            }}
            onPlaceSelected={async (place) => {
              console.log(place?.formatted_address);
              modalAddress = place?.formatted_address;
              // Get coordinates when address is selected
              const coords = await handleMapSubmit(modalAddress);
              modalCoordinates = coords;
            }}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "ng" },
            }}
            placeholder="Address"
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="City"
            defaultValue=""
            onChange={(e) => { modalCity = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="State"
            defaultValue=""
            onChange={(e) => { modalState = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="Country"
            defaultValue="Nigeria"
            onChange={(e) => { modalCountry = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="Postal Code"
            defaultValue=""
            onChange={(e) => { modalPostalCode = e.target.value; }} 
            required
          />
          <select 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]"
            defaultValue="home"
            onChange={(e) => { modalAddressType = e.target.value; }}
            required
          >
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>
          <div className="flex items-center gap-2 mb-5">
            <input 
              type="checkbox"
              id="isPrimary"
              defaultChecked={false}
              onChange={(e) => { modalIsPrimary = e.target.checked; }}
              className="h-4 w-4"
            />
            <label htmlFor="isPrimary" className="text-sm text-[#111827]">
              Set as primary address
            </label>
          </div>
          </>
        ), 
        buttons: [
          {
            label: "Add new",
            primary: true,
            onClick: async () => {
              await postAddress({
                street: modalAddress, 
                city: modalCity, 
                state: modalState,
                country: modalCountry,
                postalCode: modalPostalCode, 
                latitude: modalCoordinates?.latitude || 6.5244, 
                longitude: modalCoordinates?.longitude || 3.3792,
                addressType: modalAddressType,
                isPrimary: modalIsPrimary
              });
              closeModal();
            },
          }
        ]
      });
    };

    const handleEditAddress = (addressItem) => {
      // Local state for the modal form
      let modalAddress = addressItem.street;
      let modalCity = addressItem.city;
      let modalState = addressItem.state;
      let modalPostalCode = addressItem.postalCode;
      let modalCountry = addressItem.country || 'Nigeria';
      let modalAddressType = addressItem.addressType || 'home';
      let modalIsPrimary = addressItem.isPrimary || false;
      let modalCoordinates = { 
        latitude: addressItem.latitude, 
        longitude: addressItem.longitude 
      };
      
      openModal({
        title: "Edit Address",
        content: (
          <>
          <Autocomplete
            apiKey={GOOGLE_MAPS_APIKEY}
            style={{ 
              width: "100%", 
              height: 48, 
              borderWidth: 1, 
              borderColor: '#f1f1f1', 
              backgroundColor: '#f9fafb', 
              borderRadius: 7, 
              paddingLeft: 10, 
              marginBottom: '20px', 
              fontSize: '14px', 
              color: '#111827' 
            }}
            onPlaceSelected={async (place) => {
              console.log(place?.formatted_address);
              modalAddress = place?.formatted_address;
              // Get coordinates when address is selected
              const coords = await handleMapSubmit(modalAddress);
              modalCoordinates = coords;
            }}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "ng" },
            }}
            defaultValue={addressItem.street}
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="City"
            defaultValue={addressItem.city}
            onChange={(e) => { modalCity = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="State"
            defaultValue={addressItem.state}
            onChange={(e) => { modalState = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="Country"
            defaultValue={addressItem.country || 'Nigeria'}
            onChange={(e) => { modalCountry = e.target.value; }} 
            required
          />
          <Input 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]" 
            placeholder="Postal Code"
            defaultValue={addressItem.postalCode}
            onChange={(e) => { modalPostalCode = e.target.value; }} 
            required
          />
          <select 
            className="w-full h-12 border border-[#f1f1f1] bg-[#f9fafb] rounded-sm pl-2 mb-5 text-sm text-[#111827]"
            defaultValue={addressItem.addressType || 'home'}
            onChange={(e) => { modalAddressType = e.target.value; }}
            required
          >
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>
          <div className="flex items-center gap-2 mb-5">
            <input 
              type="checkbox"
              id="isPrimaryEdit"
              defaultChecked={addressItem.isPrimary || false}
              onChange={(e) => { modalIsPrimary = e.target.checked; }}
              className="h-4 w-4"
            />
            <label htmlFor="isPrimaryEdit" className="text-sm text-[#111827]">
              Set as primary address
            </label>
          </div>
          </>
        ), 
        buttons: [
          {
            label: "Update",
            primary: true,
            onClick: async () => {
              const addressId = addressItem._id;
              
              if (!addressId) {
                toast.error("No address ID found");
                return;
              }
              
              await updateUserAddress({
                id: addressId,
                addressData: {
                  street: modalAddress,
                  city: modalCity,
                  state: modalState,
                  country: modalCountry,
                  postalCode: modalPostalCode,
                  latitude: modalCoordinates?.latitude,
                  longitude: modalCoordinates?.longitude,
                  addressType: modalAddressType,
                  isPrimary: modalIsPrimary
                }
              });
              closeModal();
            },
          }
        ]
      });
    };

    useEffect(() => {
      getAddress()
    },[])
  
    return (
      <div className="mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
        <div className="">
          <h2 className="text-lg font-semibold">Address</h2>
          <p className="text-gray-500 mb-6">Below is your address</p>
        </div>
  
        <div className="space-y-4 max-w-2xl md:w-1/2 w-full">
          {userAddress?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-white"
            >
              <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                   <h3 className="font-medium capitalize">{item.addressType || item.state}</h3>
                   <span className="text-gray-500 text-sm p-2 shadow-sm border px-4">{item.street}</span>
                   {item.isPrimary && (
                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                   )}
                </div>             
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"  onClick={() => handleEditAddress(item)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6 max-w-2xl">
            <ButtonComponent label={'Add new'} variant={'white'} onClick={handleAddNewAddress} />
            <ButtonComponent label={'Save Changes'} variant={'primary'} />
          </div>
        </div>
      </div>
    );
  }
  
  export default function UserProfile() {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadedImageData, setUploadedImageData] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const { user, updateUser } = useAuthStore()
  const { uploadFile } = useUploadStore()

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    try {
      setImageUploading(true)
      
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      const uploadedData = await uploadFile(file, "user/profile_image")
      
      if (uploadedData) {
        console.log('Uploaded data:', uploadedData)
        setUploadedImageData({
          url: uploadedData.url,
          publicId: uploadedData.publicId,
        })
        toast.success('Image is selected and ready, click the "Save Changes" button to update your profile picture!')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
      setAvatarPreview(null)
      setUploadedImageData(null)
    } finally {
      setImageUploading(false)
    }
  }

  // Callback to clear image data after successful save
  const clearUploadedImage = () => {
    setAvatarPreview(null)
    setUploadedImageData(null)
  }

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg border">
          <ProfileHeader
            data={user}
            onUploadClick={handleAvatarChange}
            avatarPreview={avatarPreview}
            imageUploading={imageUploading}
          />

          <div className="p-6">
            {/* Pass image data and clear callback to PersonalInfo */}
            <PersonalInfo 
              uploadedImageData={uploadedImageData}
              onImageSaved={clearUploadedImage}
            />
            <AddressSection />
            
            {/* REMOVED: Save Changes button - now handled in PersonalInfo */}
          </div>
        </div>
      </div>
    </div>
  )
}