  import { useState } from "react";
  import { uploadImgBanner } from "@store/services/banners";
  import { IconMas } from "@utils/svg";
  import CreateBanner from "./CreateBanners"; // Asegúrate de importar el componente

  interface UploadBannerProps {
    getBannersList: () => void;
    type: "home" | "cuponizate" | "argencompras";
    
    
  }

  const UploadBanner = ({ getBannersList, type }: UploadBannerProps) => {
    const [modalCreate, setModalCreate] = useState(false); // Estado para abrir/cerrar el modal

    const handleCreateProduct = () => {
      setModalCreate(true); // Abrir el modal
    };

    const handleUpdoadBanner = async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "nextjs");
        const result = await uploadImgBanner(formData, type);
        if (result) {
          getBannersList();
        }
      };
    };
    console.log(handleUpdoadBanner)

    return (
      <>
        <div
          onClick={handleCreateProduct} // Abre el modal cuando se haga clic
          className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-Express-Cash-gray items-center justify-center cursor-pointer"
        >
          <IconMas />
        </div>

        {/* Modal */}
        {modalCreate && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
     <CreateBanner
  closeModal={() => setModalCreate(false)} // Función para cerrar el modal
  getBannersList={getBannersList} // Función para actualizar la lista de banners
  type={type}  // Asegúrate de pasar el valor correcto de type aquí
/>
    </div>
  )}
      </>
    );
  };

  export default UploadBanner;
