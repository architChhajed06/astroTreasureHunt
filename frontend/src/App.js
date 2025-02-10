import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignupPage"
import GamePage from "./Pages/GamePage"
import AdminPage from "./Pages/AdminPage"
import AddQuestion from "./components/addQuestion";
import LevelQuestions from "./Pages/LevelQuestions";
import ModifyQuestion from "./components/modifyQuestion";
import OTPVerificationPage from "./Pages/OTPVerificationPage";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route 
            path="/game" 
            element={
             <ProtectedRoute>
                <GamePage />
             </ProtectedRoute>
            } 
          />
          <Route 

            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/addQuestion/:levelNum" element={<AddQuestion/>}/>
          <Route path="/level/:levelNum/questions/:mongoLevelId" element={<LevelQuestions/>}/>
          <Route path="/modifyQuestion/:levelNum/:mongoLevelId" element={<ModifyQuestion/>}/>
          <Route path="/verify-otp" element={<OTPVerificationPage/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
