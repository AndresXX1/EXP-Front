import { useState, useEffect } from "react";
import { links } from "@utils/format";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconLogout } from "@utils/svg";
import { logOutAsync } from "@store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { apiUrls } from "../config/config";
import { Menu, X } from "lucide-react"; // Importamos los íconos

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const shouldHideSidebar = currentPath === "/" || currentPath === "/login";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.getElementById("sidebar");
      const buttonElement = document.getElementById("sidebar-button");
      if (
        sidebarElement &&
        buttonElement &&
        !sidebarElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(isOpen);
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  if (shouldHideSidebar) {
    return null;
  }

  return (
    <>
      <button
        id="sidebar-button"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? (
          <X size={24} className="text-gray-600" />
        ) : (
          <Menu size={24} className="text-gray-600" />
        )}
      </button>

      {/* Barra lateral */}
      <div
        id="sidebar"
        className={`flex w-[285px] font-poppins transition-transform duration-300 ease-in-out
          md:transform-none md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          fixed md:relative z-40`}
      >
        <div className="bg-expresscash-white w-[285px] fixed h-[800px] font-poppins">
          <div className="flex gap-2 mt-9 mb-7 xl:mt-12 xl:mb-10">
            <img
              className="select-none w-[235px] h-[60px] mx-auto"
              src="/login/logo_Express-Cash.png"
              alt="Logo"
            />
          </div>
          <ul className="flex flex-col gap-2">
            {links.map((link, index) => (
              <li
                key={`${link.text}-${index}`}
                className={`flex h-12 pl-3 gap-3 ${currentPath === link.to ? "text-expresscash-skyBlue border-l-4  border-expresscash-skyBlue" : "text-expresscash-textos"}`}
              >
                <div className="flex items-center justify-center gap-5">
                  <link.Icon color={currentPath === link.to ? "#8CC63F" : ""} />
                  <Link
                    to={link.to}
                    className="font-poppins text-[20px]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex items-center justify-center border-[2px] font-poppins border-expresscash-skyBlue w-[66px] h-[66px] mx-auto rounded-[25px] overflow-hidden">
            <img
              src={
                user?.avatar
                  ? apiUrls.avatarUser(user.avatar)
                  : "/path/to/default-avatar.jpg"
              }
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center truncate w-[150px] mt-6 text-expresscash-textos text-[16px] font-poppins mb-[20px] ml-[65px]">
            {user?.full_name ? user.full_name : "Nombre de usuario"}
          </p>

          <button
            className="flex items-center justify-center gap-1 text-[15.21px] text-white mt-2 cursor-pointer font-poppins border-2 border-expresscash-skyBlue bg-expresscash-skyBlue hover:bg-expresscash-green ml-[70px] hover:text-white rounded-lg p-2 transition-all"
            onClick={() => dispatch(logOutAsync())}
          >
            <IconLogout />
            Cerrar Sesión
          </button>
        </div>
      </div>
      <div
        className={`fixed ml-[285px] z-[1] font-poppins bg-expresscash-skyBlue w-[1px] h-full ${isSidebarVisible ? "" : "hidden"}`}
      ></div>
    </>
  );
};

export default Sidebar;
