import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Public from "../pages/public/Public";
import Users from "../pages/admin/Users";
import Industries from "../pages/admin/Industries";
import Portfolio from "../pages/admin/Portfolio";
import Services from "../pages/admin/Services";
import Technologies from "../pages/admin/Technologies";
import PortImages from "../pages/admin/PortfolioImages";

const Pathes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Public />} />

      {/* Admin Dashboard Route */}
      <Route path="/dashboard">
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="industries" element={<Industries />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="services" element={<Services />} />
        <Route path="techstack" element={<Technologies />} />
        <Route path="portimage" element={<PortImages />} />
      </Route>
    </Routes>
  );
};

export default Pathes;
