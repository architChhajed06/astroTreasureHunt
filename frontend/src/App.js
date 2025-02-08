import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignupPage"
import GamePage from "./Pages/GamePage"
import AdminPage from "./Pages/AdminPage"
import AddQuestion from "./components/addQuestion";
import LevelQuestions from "./Pages/LevelQuestions";
import ModifyQuestion from "./components/modifyQuestion";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/game" element={<GamePage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/admin/addQuestion/:levelNum" element={<AddQuestion/>}/>
        <Route path="/level/:levelNum/questions/:mongoLevelId" element={<LevelQuestions/>}/>
        <Route path="/modifyQuestion/:levelNum/:mongoLevelId" element={<ModifyQuestion/>}/>
      </Routes>

    </Router>
  );
}

export default App;
