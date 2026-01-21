import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ClubDashboard from './pages/ClubDashboard';
import ClubDetails from './pages/ClubDetails';
import EventDetails from './pages/EventDetails';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <ClubDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/clubs/:clubId" element={<ClubDetails />} />
                            <Route path="/events/:clubId/:eventId" element={<EventDetails />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
