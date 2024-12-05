import { IconDelete, IconEdit, IconPencil, IconX } from "@utils/svg";
import { Branch } from ".";
import { apiUrls } from "@config/config";
import {
  deleteBranchById,
  updateBranch,
  uploadImgBranch,
} from "@store/services/branches";
import { useEffect, useState } from "react";
import Modal from "@components/Modal";

export interface CardBranchProps {
  branch: Branch;
  getBranchesList: () => void;
}

const CardBranch = ({ branch, getBranchesList }: CardBranchProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [data, setData] = useState({
    name: "",
    image: "",
    address: "",
    schedules_1: "",
    schedules_2: "",
    whatsapp: "",
    phone: "",
    url: "",
  });

  const handleDelete = async () => {
    const result = await deleteBranchById(branch.id.toString());

    if (result) {
      getBranchesList();
      setModalDelete(false);
    }
  };

  const handleEdit = async () => {
    const result = await updateBranch(branch.id.toString(), data);

    if (result) {
      getBranchesList();
      setModalEdit(false);
    }
  };

  useEffect(() => {
    if (modalEdit) {
      setData({
        name: branch.name || "",
        image: branch.image || "",
        address: branch.address || "",
        schedules_1: branch.schedules_1 || "",
        schedules_2: branch.schedules_2 || "",
        whatsapp: branch.whatsapp || "",
        phone: branch.phone || "",
        url: branch.url || "",
      });
    }
  }, [modalEdit, branch]);

  const handlerChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdoadImageNotice = async () => {
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
      const result = await uploadImgBranch(formData);
      setData({
        ...data,
        image: result,
      });
    };
  };

  return (
    <>
      <Modal
        isShown={modalDelete}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-expresscash-textos font-bold max-w-[370px]">
                ¿Está seguro que desea eliminar esta sucursal?
              </p>
              <p
                className="cursor-pointer mt-2"
                onClick={() => setModalDelete(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
              Si la elimina ya no podrá recuperarla
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setModalDelete(false);
                }}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />
      <Modal
        isShown={modalEdit}
        element={
          <form
            className="px-[54px] py-12 flex flex-col w-[969px] h-[668px]"
            onSubmit={handleEdit}
          >
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-expresscash-textos font-bold">
                Nueva sucursal
              </p>
              <p className="cursor-pointer" onClick={() => setModalEdit(false)}>
                <IconX />
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-4">
                <div>
                  <div
                    onClick={handleUpdoadImageNotice}
                    className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-expresscash-gray3 border-[1px] border-solid border-expresscash-gray2 cursor-pointer"
                  >
                    {data.image === "" ? (
                      <img
                        className="w-[185-px] h-[185px] object-cover"
                        src="/edit_content/image_edit.png"
                      />
                    ) : (
                      <img
                        className="w-[185-px] h-[185px] object-cover"
                        src={apiUrls.BranchImg(data.image)}
                      />
                    )}
                  </div>
                  <p className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-expresscash-textos">
                    <IconPencil />
                    Subir foto
                  </p>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">Nombre</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Nombre"
                    name="name"
                    onChange={handlerChange}
                    value={data.name}
                    required
                  />
                  <label htmlFor="">Dirección</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Dirección"
                    name="address"
                    onChange={handlerChange}
                    value={data.address}
                    required
                  />
                  <label htmlFor="">Número de Teléfono</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Número de Teléfono"
                    name="phone"
                    onChange={handlerChange}
                    value={data.phone}
                    required
                  />
                  <label htmlFor="">Número de WhatsApp</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Número de WhatsApp"
                    name="whatsapp"
                    onChange={handlerChange}
                    value={data.whatsapp}
                    required
                  />
                  <label htmlFor="">Horario 1</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Lun a Vier 9:00 a 18:45 hs"
                    name="schedules_1"
                    onChange={handlerChange}
                    value={data.schedules_1}
                    required
                  />
                  <label htmlFor="">Horario 2</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Sab 9:00 a 13:00 hs"
                    name="schedules_2"
                    onChange={handlerChange}
                    value={data.schedules_2}
                    required
                  />
                  <p>Ubicación | Google Maps url</p>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="https://www.google.com/maps/place/expresscash+Avellaneda/@-34.649247,-58.4218763,12z/data=!4m6!3m5!1s0x95a33353b52e0ac7:0xecc21ebc001b04d4!8m2!3d-34.6606336!4d-58.3675524!16s%2Fg%2F11f3xgrr15?entry=ttu&g_ep=EgoyMDI0MTAyMy4wIKXMDSoASAFQAw%3D%3D"
                    name="url"
                    onChange={handlerChange}
                    value={data.schedules_2}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10 pb-10">
              <button
                type="button"
                onClick={() => setModalEdit(false)}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </form>
        }
      />
      <div className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-expresscash-gray mb-10 overflow-hidden">
        <div className="rounded-[13px] bg-[#F9F9F9] flex items-center relative w-full h-full">
          <img
            className="w-full h-full overflow-hidden object-cover"
            src={apiUrls.BranchImg(branch.image)}
            alt=""
          />
          <div className="absolute bottom-4 flex gap-3 right-6">
            <IconEdit
              onClick={() => setModalEdit(true)}
              className="cursor-pointer"
            />
            <IconDelete
              className="cursor-pointer"
              onClick={() => setModalDelete(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardBranch;
