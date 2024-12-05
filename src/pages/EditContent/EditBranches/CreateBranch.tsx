import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { createBranch, uploadImgBranch } from "@store/services/branches";
import { IconMas, IconPencil, IconX } from "@utils/svg";
import { useState } from "react";

interface CreateBranchProps {
  getBranchesList: () => void;
}

const CreateBranch = ({ getBranchesList }: CreateBranchProps) => {
  const [modalCreateBranch, setModalCreateBranch] = useState<boolean>(false);
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

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCreateNotice = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const response = await createBranch(data);
    if (response) {
      getBranchesList();
      setData({
        name: "",
        image: "",
        address: "",
        schedules_1: "",
        schedules_2: "",
        whatsapp: "",
        phone: "",
        url: "",
      });
      setModalCreateBranch(false);
    }
  };

  return (
    <>
      <Modal
        isShown={modalCreateBranch}
        element={
          <form
            className="px-[54px] py-12 flex flex-col w-[969px] h-[668px]"
            onSubmit={handleCreateNotice}
          >
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-Express-Cash-textos font-bold">
                Nueva sucursal
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalCreateBranch(false)}
              >
                <IconX />
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-4">
                <div>
                  <div
                    onClick={handleUpdoadImageNotice}
                    className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-Express-Cash-gray3 border-[1px] border-solid border-Express-Cash-gray2 cursor-pointer"
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
                  <p className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-Express-Cash-textos">
                    <IconPencil />
                    Subir foto o video
                  </p>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">Nombre</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Nombre"
                    name="name"
                    onChange={handlerChange}
                    value={data.name}
                    required
                  />
                  <label htmlFor="">Dirección</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Dirección"
                    name="address"
                    onChange={handlerChange}
                    value={data.address}
                    required
                  />
                  <label htmlFor="">Número de Teléfono</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Número de Teléfono"
                    name="phone"
                    onChange={handlerChange}
                    value={data.phone}
                    required
                  />
                  <label htmlFor="">Número de WhatsApp</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Número de WhatsApp"
                    name="whatsapp"
                    onChange={handlerChange}
                    value={data.whatsapp}
                    required
                  />
                  <label htmlFor="">Horario 1</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Lun a Vier 9:00 a 18:45 hs"
                    name="schedules_1"
                    onChange={handlerChange}
                    value={data.schedules_1}
                    required
                  />
                  <label htmlFor="">Horario 2</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Sab 9:00 a 13:00 hs"
                    name="schedules_2"
                    onChange={handlerChange}
                    value={data.schedules_2}
                    required
                  />
                  <p>Ubicación</p>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray text-Express-Cash-textos placeholder:text-Express-Cash-gray text-[14px] font-book"
                    type="text"
                    placeholder="https://www.google.com/maps/place/Express-Cash+Avellaneda/"
                    name="url"
                    onChange={handlerChange}
                    value={data.url}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10">
              <button
                type="button"
                onClick={() => setModalCreateBranch(false)}
                className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                className="bg-Express-Cash-skyBlue w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </form>
        }
      />
      <div
        onClick={() => setModalCreateBranch(true)}
        className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-Express-Cash-gray items-center justify-center cursor-pointer"
      >
        <IconMas />
      </div>
    </>
  );
};

export default CreateBranch;
