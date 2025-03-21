import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Copy, Edit, MapPin, PencilIcon, Trash2, Upload } from 'lucide-react';
import CountryCodeSelect from '../GetCountryCode';
import { ButtonComponent } from '../ButtonComponent';
import { useModal } from '@/lib/ModalContext';
import AddressForm from './AddressForm';
import useAuthStore from '@/store/authStore';
import Autocomplete from "react-google-autocomplete";
import getCoordinatesFromAddress from './GetCordinatesFromAddress';
import toast from 'react-hot-toast';
import useAddressStore from '@/store/addressStore';


const GOOGLE_MAPS_APIKEY = 'AIzaSyCIgMXmltDX6vNpGWxAR0_egUzH4sk8aHk'
  

  function ProfileHeader({ profilePicture, onProfilePictureChange, data }) {
    const {loading} = useAuthStore()
    // Create a reference to the file input
    const fileInputRef = useRef(null);

    const handleUploadClick = (e) => {
      e.preventDefault(); // Prevent default button behavior
      fileInputRef.current.click(); // Trigger file input click
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
          <div className="relative">
            <img
              src={profilePicture || 'profile-pic.png'}
              alt="Profile picture"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <label htmlFor="profile-picture" className="absolute bottom-0 right-0 cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={onProfilePictureChange}
              />
              <Button 
                onClick={handleUploadClick} 
                variant="ghost" 
                size="icon" 
                className="bg-white rounded-full shadow-md"
              >
                <Upload className="h-4 w-4 text-gray-500" />
              </Button>
            </label>
          </div>
        </div>
        <div className="ml-48 pt-4">
          <h1 className="text-2xl font-semibold capitalize">{loading ? "" : `${data?.firstname} ${data?.lastname}`}</h1>
          <p className="text-gray-500">{data?.email}</p>
        </div>
      </div>
    );
  }

  
  function PersonalInfo() {
    const [formData, setFormData] = useState({
      firstname: "",
      lastname: "",
      othername: "",
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

    const handleSubmit = () => {
      updateUser(
        { firstname: formData.firstname,
          lastname: formData.lastname,
          othername: formData.othername,
          dob: formData.date, 
          /* isOnboarded, */ 
      }
      )
    }

    console.log({...formData})
  
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
              value={formData.firstName}
              placeholder="Enter firstname"
              onChange={handleInputChange}
              className="h-12 mb-4"
            />
            <Input
              name="lastname"
              value={formData.lastName}
              placeholder="Enter lastname"
              onChange={handleInputChange}
              className="h-12 mb-4"
            />
            <Input
              name="othername"
              value={formData.otherName}
              placeholder="Enter othername"
              onChange={handleInputChange}
              className="h-12 mb-4"
            />
          </div>
  
          {/* <div className="flex gap-4">
            <CountryCodeSelect />
            <div className="relative flex-1">
              <Input
                name="phone"
                placeholder="08000000000"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
          </div> */}
  
          <div className="relative">
            <Popover>
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
            </Popover>
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
            label={'Save Changes'} 
            variant={'primary'} 
            onClick={handleSubmit}/>
          </div>
        </div>
      </div>
    );
  }
  
  function AddressSection() {
    const [address, setAddress] = useState(null);
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const {openModal, closeModal} = useModal()
    const {postAddress, getAddress, userAddress, updateUserAddress} = useAddressStore()

    console.log(
      {userAddress}
    )

    const handleMapSubmit = async (e) => {
      //e.preventDefault();
      //setLoading(true);
  
      const apiKey = GOOGLE_MAPS_APIKEY; // Replace with your API key
      const coords = await getCoordinatesFromAddress(address, apiKey);
  
      if (coords) {
        setCoordinates(coords);
      } else {
        toast.error("Unable to fetch coordinates for the given address.");
      }
  
      //setLoading(false);
    };

    const handleSubmitAddress = async () => {
      await postAddress({street: address, city: city, state: state, postalCode: postalCode, latitude: coordinates?.latitude, longitude: coordinates?.longitude})
    }

    const handleUpdateUserAddress = async(addressItem) => {
      const addressId = addressItem._id;
      
      if (!addressId) {
        toast.error("No address ID found");
        return;
      }
      
      // Use the current values or allow editing them
      await updateUserAddress({
        id: addressId,
        addressData: {
          street: address || addressItem.street,
          city: city || addressItem.city,
          state: state || addressItem.state,
          postalCode: postalCode || addressItem.postalCode,
          // Keep existing coordinates if new ones aren't provided
          latitude: coordinates?.latitude || addressItem.latitude,
          longitude: coordinates?.longitude || addressItem.longitude
        }
      });
    }

    useEffect(() => {
      if(address) {
        handleMapSubmit()
      }
    },[address])

    console.log("Latitude", coordinates?.latitude)
    console.log("Logitude", coordinates?.longitude)

    const handleAddNewAddress = () => {
      openModal({
        title: "New Address",
       /*  content: <AddressForm />, */
        content: (
          <>
          <Autocomplete
          apiKey={GOOGLE_MAPS_APIKEY}
          style={{ width: "100%", height: 48, borderWidth: 1, borderColor: 'f1f1f1', backgroundColor: '#f9fafb', borderRadius:7, paddingLeft: 10, marginBottom: '20px', fontSize: '14px', color: '#111827' }}
          onPlaceSelected={(place, inputRef, autocomplete) => {
            console.log(place?.formatted_address);
            setAddress(place?.formatted_address)
          }}
          options={{
            //types: ["(regions)"],
            //componentRestrictions: { country: "ng" },
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "ng" },
          }}
          //defaultValue="Nigeria"
          defaultValue={["Address"]}
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)} 
          required
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)} 
          required
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)} 
          required
          />
          </>
        ), 
        buttons: [
          {
            label: "Add new",
            primary: true,
            onClick: () => {
              // Handle adding new address
              handleSubmitAddress();
              closeModal();
            },
          }
        ]
      });
    };

    const handleEditAddress = (addressItem) => {
      // Pre-fill form fields with current address data
      setAddress(addressItem.street);
      setCity(addressItem.city);
      setState(addressItem.state);
      setPostalCode(addressItem.postalCode);
      
      openModal({
        title: "Edit Address",
        content: (
          <>
          <Autocomplete
            apiKey={GOOGLE_MAPS_APIKEY}
            style={{ width: "100%", height: 48, borderWidth: 1, borderColor: 'f1f1f1', backgroundColor: '#f9fafb', borderRadius:7, paddingLeft: 10, marginBottom: '20px', fontSize: '14px', color: '#111827' }}
            onPlaceSelected={(place, inputRef, autocomplete) => {
              console.log(place?.formatted_address);
              setAddress(place?.formatted_address)
            }}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "ng" },
            }}
            defaultValue={addressItem.street}
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)} 
            required
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)} 
            required
          />
          <Input className="w-full h-12 border border-['f1f1f1'] bg-['#f9fafb'] rounded-sm pl-2 mb-5 text-sm text-['#111827']" 
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)} 
            required
          />
          </>
        ), 
        buttons: [
          {
            label: "Update",
            primary: true,
            onClick: () => {
              handleUpdateUserAddress(addressItem);
              closeModal();
            },
          }
        ]
      });
    };

    useEffect(() => {
      getAddress()
    },[])

    const addresses = [
      { type: 'Home', address: '56 Opebi road, Sabo Yaba.' },
      { type: 'Office', address: '56 Opebi road, Sabo Yaba.' },
    ];
  
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
                 {/*  <h3 className="font-medium">{item.type}</h3>
                  <span className="text-gray-500 text-sm p-2 shadow-sm border px-4">{item.address}</span> */}
                   <h3 className="font-medium">{item.state}</h3>
                   <span className="text-gray-500 text-sm p-2 shadow-sm border px-4">{item.street}</span>
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
    const [profilePicture, setProfilePicture] = useState(null)
    const { user } = useAuthStore() 

    const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a URL for the selected image file
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl); // Just set the URL string directly
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
         {/*  <h1 className="text-2xl font-semibold p-6">Profile</h1> */}
  
          <div className="bg-white rounded-lg border">
            <ProfileHeader
            profilePicture={profilePicture}
            onProfilePictureChange={handleProfilePictureChange}
            data={user}
            />
  
            <div className="p-6">
              <PersonalInfo />
              <AddressSection />
            </div>
          </div>
        </div>
      </div>
    );
  }