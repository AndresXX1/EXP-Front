import { IconDelete, IconEdit, IconPencil, IconX } from "@utils/svg";
import { Notice } from "./EditNotice";
import { useState } from "react";
import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
// import { deleteNoticeById } from "@store/services/notices";

export interface CardNoticeProps {
  notice: Notice;
  getNoticesList: () => void;
}

const CardBranches = ({ notice }: CardNoticeProps) => {
  const [modalEditNotice, setModalEditNotice] = useState<boolean>(false);
  const [modalDeleteNotice, setModalDeleteNotice] = useState<boolean>(false);
  //   const handleDelete = async () => {
  //     const result = await deleteNoticeById(notice.id);

  //     if (result) {
  //       getNoticesList();
  //     }
  //   };
  return (
    <>
      <Modal
        isShown={modalDeleteNotice}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-Express-Cash-textos font-bold max-w-[370px]">
                ¿Está seguro que desea eliminar esta noticia?
              </p>
              <p
                className="cursor-pointer mt-2"
                onClick={() => setModalDeleteNotice(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-book text-Express-Cash-gray w-[380px] mb-10 mt-1">
              Si la elimina ya no se podrá recuperarla.
            </p>
            <div className="flex gap-4">
              <button
                // onClick={handleDelete}
                className="bg-Express-Cash-red w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setModalDeleteNotice(false);
                }}
                className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />
      <Modal
        isShown={modalEditNotice}
        element={
          <div className="px-[54px] py-12 flex flex-col w-[969px] h-[668px]">
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-Express-Cash-textos font-bold">
                Editar noticia
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalEditNotice(false)}
              >
                <IconX />
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-4">
                <div>
                  <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-Express-Cash-gray3 border-[1px] border-solid border-Express-Cash-gray2">
                    <img
                      className="w-[185px] h-[185px]"
                      src="/edit_content/image_banner_2.png"
                    />
                  </div>
                  <div className="flex gap-1 mt-3 mb-5">
                    <p className="flex items-center gap-1 text-[14px] text-Express-Cash-textos font-book cursor-pointer">
                      <IconPencil />
                      Editar foto
                    </p>
                    <p className="flex items-center text-[14px] text-Express-Cash-red font-book cursor-pointer">
                      <IconDelete className="w-[22px] h-[22px]" />
                      Eliminar
                    </p>
                  </div>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label
                    className="text-Express-Cash-textos font-bold text-[14px]"
                    htmlFor=""
                  >
                    Título
                  </label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Título"
                  />

                  <label
                    className="text-Express-Cash-textos font-bold text-[14px]"
                    htmlFor=""
                  >
                    Fecha
                  </label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="1 / 1 / 2025"
                  />

                  <label
                    className="text-Express-Cash-textos font-bold text-[14px]"
                    htmlFor=""
                  >
                    Descripción
                  </label>
                  <textarea
                    className="w-[617px] h-[181px] text-[16px] font-book p-3 text-Express-Cash-textos align-top border border-Express-Cash-gray rounded-[5px] resize-none placeholder:text-Express-Cash-textos"
                    placeholder="Cuerpo de texto"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={() => setModalEditNotice(false)}
                className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                // onClick={() => setModalCreateNotice(false)}
                className="bg-Express-Cash-skyBlue w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book"
              >
                Guardar
              </button>
            </div>
          </div>
        }
      />
      <div className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-Express-Cash-gray mb-10">
        <div className="rounded-[13px] bg-[#F9F9F9] flex items-center relative w-full h-full">
          <img
            className="w-full h-full overflow-hidden object-cover"
            src={apiUrls.noticeImg(notice.url)}
            alt=""
          />
          <div className="absolute bottom-4 flex gap-3 right-6">
            <IconEdit
              onClick={() => setModalEditNotice(true)}
              className="cursor-pointer"
            />
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

export default CardBranches;
