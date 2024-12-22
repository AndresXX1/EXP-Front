import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { IconDelete, IconX } from "@utils/svg";
import { useState } from "react";
import { Banner } from "../EditBanners";
import { deleteBannerById } from "@store/services/banners";

interface CardBannerProps {
  banner: Banner;
  getBannersList: () => void;
  type: string;
}

const CardBanner = ({ banner, getBannersList }: CardBannerProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    const result = await deleteBannerById(banner.id);

    if (result) {
      getBannersList();
      setModalDelete(false);
    }
  };
  return (
    <>
      <Modal
        isShown={modalDelete}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-expresscash-textos font-poppins max-w-[370px]">
                ¿Está seguro que desea eliminar esta imagen del home banner?
              </p>
              <p
                className="cursor-pointer mt-2"
                onClick={() => setModalDelete(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-poppins text-expresscash-gray w-[380px] mb-10 mt-1">
              Si la elimina ya no se verá en el home de la app.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setModalDelete(false);
                }}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />
      <div className="max-w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-expresscash-gray">
        <div className="rounded-[13px] bg-[#F9F9F9] flex items-center relative w-[306px]">
          <img
            className="w-full h-full overflow-hidden rounded-[13px]"
            src={apiUrls.bannerImg(banner.url)}
            alt=""
          />
          <div
            onClick={() => setModalDelete(true)}
            className="absolute bottom-4 flex gap-2 right-5 cursor-pointer"
          >
            <IconDelete />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardBanner;
