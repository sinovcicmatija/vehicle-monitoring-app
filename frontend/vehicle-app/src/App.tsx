import SideBar from './components/SideBar/sideBar'
import ToolBar from './components/Toolbar/toolBar'
import { useState } from "react";

function App() {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="flex">
      <ToolBar 
      toggleSidebar={() => setIsSidebarOpened(true)} 
      toggleProfileMenu={() => setIsProfileMenuOpen((prev) => !prev)}
      isProfileMenuOpen={isProfileMenuOpen}/>
      <SideBar isOpen={isSidebarOpened}/>

      {isSidebarOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpened(false)}
        ></div>
      )}

    </div>
  )
}

export default App
