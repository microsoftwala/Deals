import Home from "./pages/home";
import Login from "./pages/login";
import CreateEmp from "./pages/createEmp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmpList from "./pages/empList";
import EditEmp from "./pages/editEmp";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cemp" element={<CreateEmp />} />
          <Route path="/emplist" element={<EmpList />} />
          <Route path="/editEmp/:id" element={<EditEmp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
