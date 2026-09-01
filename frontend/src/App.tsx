import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EmployeeList from "./pages/EmployeeList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="/employees/:id/edit" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
