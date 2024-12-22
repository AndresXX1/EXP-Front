import { IconDelete, IconX } from "@utils/svg";
import { Notice } from "./EditNotice";
import { useState } from "react";
import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { deleteNoticeById } from "@store/services/notices";

export interface CardNoticeProps {
  notice: Notice;
  getNoticesList: () => void;
}

const CardNotice = ({ notice, getNoticesList }: CardNoticeProps) => {
  const [modalDeleteNotice, setModalDeleteNotice] = useState<boolean>(false);
  const handleDelete = async () => {
    const result = await deleteNoticeById(notice.id);

    if (result) {
      getNoticesList();
    }
  };

  return (
    <>
      <Modal
        isShown={modalDeleteNotice}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-expresscash-textos font-poppins max-w-[370px]">
                ¿Está seguro que desea eliminar esta noticia?
              </p>
              <p
                className="cursor-pointer mt-2"
                onClick={() => setModalDeleteNotice(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-poppins text-expresscash-gray w-[380px] mb-10 mt-1">
              Si la elimina ya no podrá recuperarla.
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
                  setModalDeleteNotice(false);
                }}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />
      <div className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-expresscash-gray mb-10">
        <div className="rounded-[13px] bg-[#F9F9F9] flex items-center relative w-full h-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={apiUrls.noticeImg(notice.url)}
            alt=""
          />
          <div className="absolute bottom-4 flex gap-3 right-6">
            <IconDelete
              className="cursor-pointer"
              onClick={() => setModalDeleteNotice(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardNotice;
