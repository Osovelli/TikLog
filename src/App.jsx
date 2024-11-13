import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { Signup } from './pages/AuthPages/Signup';
import { ForgotPassword} from './pages/AuthPages/ForgotPassword';
import { ResetPasswordOtp } from './pages/AuthPages/ResetPasswordOtp';
import { ResetPassword } from './pages/AuthPages/ResetPassword';
import { ResetPasswordSuccess } from './pages/AuthPages/ResetPasswordSuccess';
import { SignUpSuccess } from './pages/AuthPages/SignupSuccess';
import { SignUpOTP } from './pages/AuthPages/SignupOtp';
import { SignupComplete } from './pages/AuthPages/SignUpComplete';
import { HomePage } from './pages/HomePage';
import { DeliveryPage } from './pages/DeliveryPage';
import { MyDeliveries } from './pages/MyDeliveries';
import { Wallet } from './pages/WalletPage';
import { Profile } from './pages/Profile';
import { Notification } from './pages/Notification';
import { SettingsPage } from './pages/SettingsPage';


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<Signup /> } />        
                <Route path='/signin' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/reset-password/success' element={<ResetPasswordSuccess />} />
                <Route path='/reset-password-otp' element={<ResetPasswordOtp />} />
                <Route path='/signup/success' element={<SignUpSuccess />} />
                <Route path='/signup/complete' element={<SignupComplete />} />
                <Route path='/signup-otp' element={<SignUpOTP/>} />
                <Route path='/' element={<HomePage />} />
                <Route path='/delivery' element={<DeliveryPage />} />
                <Route path='/deliveries' element={<MyDeliveries />} />
                <Route path='/wallet' element={<Wallet />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/notification' element={<Notification />} />
                <Route path='/settings' element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
