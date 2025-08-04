import { AppLayout } from '@/components/AppLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { DeliveryOverview } from '@/components/DeliveryOverview'
import { DeliveryTable } from '@/components/_HomeOVerviewComponents/DeliveryTable'
import { OngoingDelivery } from '@/components/_HomeOVerviewComponents/OngoingDelivery'
import NewDeliverySideMenu from '@/components/_HomeOVerviewComponents/DeliverySideMenu'
import { WalletCard } from '@/components/_HomeOVerviewComponents/WalletCard'
import { HomeIcon, Plus, SearchCheck } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useModal } from '@/lib/ModalContext'
import { DeliveryDetails } from '@/components/_HomeOVerviewComponents/DeliveryDetails'
import { WalletCard as WalletIcon } from '@/icon/Icons'

export const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {openModal, closeModal} = useModal()

  const handleDeliveryModal = useCallback(() => {
    setIsMenuOpen(false);
    openModal({
      title: "",
      content: <DeliveryDetails />,
      icon: <WalletIcon />,
      buttons: [
        { label: 'Cancel', onClick: closeModal },
        { 
          label: 'Continue', 
          onClick: () => {
            closeModal();
            setTimeout(() => {
              openModal({
                title: "Search for Riders",
                content: 'Hang in there while we connect you to the perfect rider',
                icon: <SearchCheck />,
                buttons: [
                  { label: 'Cancel', onClick: closeModal },
                ]
              });
            }, 600); // 300ms delay, adjust as needed
          }, 
          primary: true 
        }
      ]
    });
  }, [openModal, closeModal]);

  return (
    <AppLayout title={'Home'} icon={<HomeIcon />}>
        <div className="p-8 mt-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold">Overview</h2>
                <span className='text-sm text-[#868C98]'>Last updated Tue 25 Sep, 2024 09:45pm</span>
              </div>
              <ButtonComponent 
              variant='primary' 
              icon={<Plus size={16}/>} 
              label={"Create New"} 
              buttonStyles="px-4" 
              onClick={() => setIsMenuOpen(true)} 
              />
            </div>
            
            {/* Placeholder for main content */}
            <div className="rounded-lg shadow-sm">
              <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-2">
                <DeliveryOverview />
                <WalletCard />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <DeliveryTable />
              <OngoingDelivery />
              </div>
            </div>
            <NewDeliverySideMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              openModal={handleDeliveryModal}

            />
          </div>
    </AppLayout>
  )
}
