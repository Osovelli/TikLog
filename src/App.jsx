import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { Signup } from './pages/AuthPages/Signup';
import { ForgotPassword} from './pages/AuthPages/ForgotPassword';
import { ResetPasswordOtp } from './pages/AuthPages/ResetPasswordOtp';
import { ResetPassword } from './pages/AuthPages/ResetPassword';
import { ResetPasswordSuccess } from './pages/AuthPages/ResetPasswordSuccess';
import { SignUpSuccess } from './pages/AuthPages/SignupSuccess';
import { SignUpOTP } from './pages/AuthPages/SignupOtp';
import { GetToKnowUser } from './pages/AuthPages/SignUpComplete';
import { HomePage } from './pages/HomePage';
import { DeliveryPage } from './pages/DeliveryPage';
import { MyDeliveries } from './pages/MyDeliveries';
import { Wallet } from './pages/WalletPage';
import { Profile } from './pages/Profile';
import { Notification } from './pages/Notification';
import { SettingsPage } from './pages/SettingsPage';
<<<<<<< Updated upstream
import { Toaster } from 'react-hot-toast';
=======
<<<<<<< Updated upstream
=======
import { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
>>>>>>> Stashed changes
>>>>>>> Stashed changes


function App() {
     const ProtectedRoute = ({ children }) => {  
        const token = localStorage.getItem('accessToken');
         if (!token) {
            return <Navigate to='/signin' replace />;
        }
        // Optional: Check if token is expired
        try {
            const decoded = jwtDecode(token);
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('accessToken');
                return <Navigate to='/signin' replace />;
            }
        } catch (e) {
            localStorage.removeItem('accessToken');
            return <Navigate to='/signin' replace />;
        }

        return children;
    };

  const RedirectAuthenticatedUser = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    console.log("Token", token)
    // (isAuthenticated && user ) {
    if (token) {
      return <Navigate to='/' replace />;
    }
	return children; 
  };
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<Signup /> } />        
                <Route path='/signin' element={
                    <RedirectAuthenticatedUser>
                        <LoginPage />
                    </RedirectAuthenticatedUser>} 
                />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/reset-password/success' element={<ResetPasswordSuccess />} />
                <Route path='/reset-password-otp' element={<ResetPasswordOtp />} />
                <Route path='/signup/success' element={<SignUpSuccess />} />
                <Route path='/signup/get-to-know' element={<GetToKnowUser/>} />
                <Route path='/signup-otp' element={<SignUpOTP/>} />
                <Route path='/' element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>} 
                />
                <Route path='/deliveries' element={
                    <ProtectedRoute>
                        <MyDeliveries />
                    </ProtectedRoute>} 
                />
                <Route path='/delivery/:deliveryId' element={
                    <ProtectedRoute>
                        <DeliveryPage />
                    </ProtectedRoute>} 
                />
                <Route path='/delivery' element={
                    <ProtectedRoute>
                        <DeliveryPage />
                    </ProtectedRoute>} 
                />
                <Route path='/wallet' element={
                    <ProtectedRoute>
                        <Wallet />
                    </ProtectedRoute>} 
                />
                <Route path='/profile' element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>} 
                />
                <Route path='/notification' element={
                    <ProtectedRoute>
                        <Notification />
                    </ProtectedRoute>} 
                />
                <Route path='/settings' element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>} 
                />
            </Routes>
            <Toaster />
        </BrowserRouter>
    )
}

export default App
