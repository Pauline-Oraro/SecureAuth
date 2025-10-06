import {Navigate, Routes, Route } from "react-router-dom"
import FloatingShape from "./components/FloatingShape.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore.js"
import { useEffect } from "react"
import DashboardPage from "./pages/DashboardPage.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"


const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};



const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">

      <FloatingShape
      color="bg-green-500"
      size="w-64 h-64"
      top="-5%"
      left="10%"
      delay={0}
      />

      <FloatingShape
      color="bg-emerald-500"
      size="w-68 h-48"
      top="70%"
      left="80%"
      delay={5}
      />

      <FloatingShape
      color="bg-lime-500"
      size="w-32 h-32"
      top="40%"
      left="-10%"
      delay={2}
      />

      <Routes>

        <Route 
        path='/' 
        element={<ProtectedRoute>
							      <DashboardPage />
						</ProtectedRoute>} 
        />

        <Route 
        path="/signup" 
        element={<RedirectAuthenticatedUser>
							    <SignUpPage />
						</RedirectAuthenticatedUser>} 
        />

        <Route 
        path="/login" 
        element={<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>} 
        />

        <Route path='/verify-email' element={<EmailVerificationPage />} />


        <Route 
        path="/forgot-password" 
        element={<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>} 
        />


      </Routes>

      <Toaster/>

    </div>
  )
}

export default App
