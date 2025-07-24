import { Route, Routes } from "react-router-dom";
import CategoryDetails from "./components/Categories/CategoryDetails";
import ListCategories from "./components/Categories/ListCategories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListCategories />} />
      <Route path="/categories/:id" element={<CategoryDetails />} />
    </Routes>
  );
}

export default App;
