import SideBar from './components/SideBar/sideBar'
import ToolBar from './components/Toolbar/toolBar'
import Home from './components/Home/home'
import Dashboard from './components/LiveDashboard/liveDashboard';
import ServiceHistory from './components/ServiceHistory/serviceHistory';
import CarStatus from './components/CarStatus/carStatus';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex">
        <ToolBar
          toggleSidebar={() => setIsSidebarOpened(true)}
          toggleProfileMenu={() => setIsProfileMenuOpen((prev) => !prev)}
          isProfileMenuOpen={isProfileMenuOpen} />
        <SideBar isOpen={isSidebarOpened} />

        <div className="content">
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/status" element={<CarStatus />} />
            <Route path="/history" element={<ServiceHistory />} />
          </Routes>
        </div>

        {isSidebarOpened && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpened(false)}
          ></div>
        )}

      </div>
    </Router>
  )
}

export default App
