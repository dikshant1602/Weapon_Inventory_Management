import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Pages/Sidebar';
import Records from './Components/Pages/Records';
import WeaponsEntry from './Components/Pages/WeaponsEntry/WeaponsEntry';
import Dashboard from './Components/Pages/Admin/Admin-Dashboard';
import AddCategory from './Components/Pages/Forms/Add-Category';
import SubCategory from './Components/Pages/Forms/Sub-Category';
import AddWeapon from './Components/Pages/Forms/Add-Weapon';
import ViewIncharge from './Components/Pages/Admin/ViewIncharge';
import AssignWeapon from './Components/Pages/WeaponsEntry/AssignWeapon/AssignWeapon';
import WaeponRecord from './Components/Pages/WeaponsEntry/AssignWeapon/WeaponRecord';
import AddWeaponDetail from './Components/Pages/Forms/Add-Weapon-Detail';
import WeaponData from './Components/Pages/Weapon-Data';
import DailyRecords from './Components/Pages/WeaponsEntry/AssignWeapon/Add-Daily-Records';
import ReturnWeapon from './Components/Pages/WeaponsEntry/ReturnWeapon/ReturnWeapon';
import AdminLogin from './Components/Pages/Admin/Admin-Login';
import ReturnForm from './Components/Pages/WeaponsEntry/AssignWeapon/return-Daily-Records';
import DamageWeaponRecords from './Components/Pages/WeaponsEntry/AssignWeapon/DamageWeaponRecords';
import WeaponEntry from './card/WeaponEntry';
import AddBullet from './Components/Pages/Forms/Add-Bullet';
import AllWeponRecord from './Components/Pages/WeaponsEntry/AssignWeapon/AllWeponRecord';
import Footer from './Components/Pages/Footer';
import ProtectedRoute from './Services/ProtectedRoutes';
const App = () => {
  const location = useLocation();
  
  const showSidebar = location.pathname !== '/';

  return (
    <div className="App d-flex">
      {showSidebar && <Sidebar />}
      <div className="flex-grow-1">
        <div className="content p-3">
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route
              path="/admindashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/records"
              element={<ProtectedRoute element={<Records />} />}
            />
            <Route
              path="/overallrecord"
              element={<ProtectedRoute element={<AllWeponRecord />} />}
            />
            <Route
              path="/weaponrecord"
              element={<ProtectedRoute element={<WaeponRecord />} />}
            />
            <Route
              path="/dailyrecords"
              element={<ProtectedRoute element={<DailyRecords />} />}
            />
            <Route
              path="/wepoanreturnDaily"
              element={<ProtectedRoute element={<ReturnForm />} />}
            />
            <Route
              path="/damagedweapons"
              element={<ProtectedRoute element={<DamageWeaponRecords />} />}
            />
            <Route
              path="/weapondata"
              element={<ProtectedRoute element={<WeaponData />} />}
            />
            <Route
              path="/weaponentry"
              element={<ProtectedRoute element={<WeaponEntry />} />}
            />
            <Route
              path="/addcategory"
              element={<ProtectedRoute element={<AddCategory />} />}
            />
            <Route
              path="/addsubcategory"
              element={<ProtectedRoute element={<SubCategory />} />}
            />
            <Route
              path="/addBullet"
              element={<ProtectedRoute element={<AddBullet />} />}
            />
            <Route
              path="/addweapon"
              element={<ProtectedRoute element={<AddWeapon />} />}
            />
            <Route
              path="/addweapondetail"
              element={<ProtectedRoute element={<AddWeaponDetail />} />}
            />
            <Route
              path="/allotweapon"
              element={<ProtectedRoute element={<WeaponsEntry />} />}
            />
            <Route
              path="/assignweapon"
              element={<ProtectedRoute element={<AssignWeapon />} />}
            />
            <Route
              path="/returnweapon"
              element={<ProtectedRoute element={<ReturnWeapon />} />}
            />
            <Route
              path="/superAdmin"
              element={<ProtectedRoute element={<ViewIncharge />} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
