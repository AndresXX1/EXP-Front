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

  // Estado para controlar si la barra lateral está abierta o cerrada
  const [isOpen, setIsOpen] = useState(false);

  // Estado para manejar la visibilidad de la barra lateral en pantallas grandes
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Función para alternar el estado de la barra lateral
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar la barra lateral cuando se hace clic fuera de ella
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

    // Agregar el evento de clic
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Detectar el tamaño de la ventana para cambiar la visibilidad de la barra lateral
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarVisible(true); // Visible en pantallas grandes
      } else {
        setIsSidebarVisible(isOpen); // Solo visible si está abierta en pantallas pequeñas
      }
    };

    // Detectar cambios de tamaño
    window.addEventListener("resize", handleResize);

    // Llamar la función una vez al cargar el componente
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburguesa, solo visible en pantallas pequeñas */}
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
        className={`flex w-[285px] font-book transition-transform duration-300 ease-in-out
          md:transform-none md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          fixed md:relative z-40`}
      >
        <div className="bg-expresscash-white w-[285px] fixed">
          <div className="flex gap-2 mt-9 mb-7 xl:mt-12 xl:mb-10">
            <img
              className="select-none w-[235px] h-[50px] mx-auto"
              src="/login/logo_Express-Cash.png"
              alt="Logo"
            />
          </div>
          <ul className="flex flex-col gap-2">
            {links.map((link, index) => (
              <li
                key={`${link.text}-${index}`}
                className={`flex h-12 pl-3 gap-3 ${currentPath === link.to ? "text-expresscash-skyBlue border-l-8 pl-6 border-expresscash-skyBlue" : "text-expresscash-textos border-l-8 border-transparent pl-6"}`}
              >
                <div className="flex items-center justify-center gap-5">
                  <link.Icon color={currentPath === link.to ? "#8CC63F" : ""} />
                  <Link
                    to={link.to}
                    className="font-book text-[20px]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex items-center justify-center border-[2px] border-expresscash-skyBlue w-[66px] h-[66px] mx-auto rounded-[15px]">
            {user && <img src={apiUrls.avatarUser(user.avatar)} alt="avatar" />}
          </div>
          <p className="text-center mt-6 text-expresscash-textos text-[23px] font-book">
            {user?.full_name ? user.full_name : "Nombre de usuario"}
          </p>

          <p
            className="flex items-center justify-center gap-1 text-[15.21px] text-expresscash-red mt-2 cursor-pointer font-book"
            onClick={() => dispatch(logOutAsync())}
          >
            <IconLogout />
            Cerrar Sesión
          </p>
        </div>
      </div>

      {/* Línea divisoria visible solo cuando la barra lateral está abierta en pantallas pequeñas o siempre en pantallas grandes */}
      <div
        className={`fixed ml-[285px] z-[1] bg-expresscash-skyBlue w-[1px] h-full ${isSidebarVisible ? "" : "hidden"}`}
      ></div>
    </>
  );
};

export default Sidebar;
