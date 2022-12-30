import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUser from "./pages/CreateUser"
import UserDetails from "./pages/UserDetails"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/create-user" exact element={<CreateUser/>}/>
        <Route path="/user-details" exact element={<UserDetails/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
