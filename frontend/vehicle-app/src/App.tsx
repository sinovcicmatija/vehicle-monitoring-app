import SideBar from './components/SideBar/sideBar'
import ToolBar from './components/Toolbar/toolBar'
import Home from './components/Home/home'
import Dashboard from './components/LiveDashboard/liveDashboard';
import ServiceHistory from './components/ServiceHistory/serviceHistory';
import CarStatus from './components/CarStatus/carStatus';
import Login from './components/Auth/login';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import type { LoggedInUserDTO } from './components/Util/loggedInUserDTO';
import Registration from './components/Auth/registration';
import NotificationModel from './components/Util/Notification/notificationModel';
import Loader from './components/Util/Loader/loaderModel';

function App() {
  const [user, setUser] = useState<LoggedInUserDTO | null>(null);
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if(storedUser)
    {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      {!user ? (
      <Routes>
        <Route path="/notification" element={<NotificationModel type='info' message='Info!'/>}/>
        <Route path="/loader" element={<Loader type="spinner"/>}/>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login  setUser={setUser}/>} />
        <Route path="/registration" element={<Registration />}/>
      </Routes>
      ) : (
      <div className="flex">
        <ToolBar
          toggleSidebar={() => setIsSidebarOpened(true)}
          toggleProfileMenu={() => setIsProfileMenuOpen((prev) => !prev)}
          isProfileMenuOpen={isProfileMenuOpen}
          onLogout={() => setUser(null)}
          loggedInUser={user} />
        <SideBar isOpen={isSidebarOpened} />

        <div className="content h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Home loggedInUser={user}/>} />
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
      )}
    </Router>
  )
}


export default App
