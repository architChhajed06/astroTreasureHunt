import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignupPage"
import GamePage from "./Pages/GamePage"
import AdminPage from "./Pages/AdminPage"
import AddQuestion from "./Pages/AddQuestionPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/game" element={<GamePage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/admin/add-question" element={<AddQuestion/>}/>
      </Routes>
    </Router>
  );
}

export default App;
