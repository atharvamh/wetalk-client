import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomForm from './components/CustomForm';
import RouteError from './components/RoutingError';
import ResetPassword from './components/ResetPassword';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isSignup, setIsSignup] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<CustomForm isSignup={isSignup} setIsSignup={setIsSignup} />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<RouteError />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
