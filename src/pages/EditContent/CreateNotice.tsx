import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { uploadImgNotice, uploadNotice } from "@store/services/notices";
import { IconMas, IconPencil, IconX } from "@utils/svg";
import { useState } from "react";

interface CreateNoticeProps {
  getNoticesList: () => void;
}

const CreateNotice = ({ getNoticesList }: CreateNoticeProps) => {
  const [modalCreateNotice, setModalCreateNotice] = useState<boolean>(false);
  const [urlImg, setUrlImg] = useState<string>("");
  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
  });

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
      const result = await uploadImgNotice(formData);
      setUrlImg(result);
    };
  };

  const handleCreateNotice = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const response = await uploadNotice({
      data,
      urlImg,
    });
    if (response) {
      getNoticesList();
      setData({
        title: "",
        description: "",
        date: "",
      });
      setUrlImg("");
      setModalCreateNotice(false);
    }
  };
  return (
    <>
      <Modal
        isShown={modalCreateNotice}
        element={
          <form
            className="px-[54px] py-12 flex flex-col w-[969px] h-[668px]"
            onSubmit={handleCreateNotice}
          >
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-expresscash-textos font-bold">
                Nueva noticia
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalCreateNotice(false)}
              >
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
                    {urlImg === "" ? (
                      <img
                        className="w-[185-px] h-[185px] object-cover"
                        src="/edit_content/image_edit.png"
                      />
                    ) : (
                      <img
                        className="w-[185-px] h-[185px] object-cover"
                        src={apiUrls.noticeImg(urlImg)}
                      />
                    )}
                  </div>
                  <p className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-expresscash-textos">
                    <IconPencil />
                    Subir foto o video
                  </p>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="">Título</label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="Título"
                    name="title"
                    onChange={handlerChange}
                    value={data.title}
                    required
                  />

                  <label htmlFor="date">Fecha</label>
                  <input
                    id="date"
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    placeholder="1 / 1 / 2025"
                    name="date"
                    onChange={handlerChange}
                    value={data.date}
                    required
                  />
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    className="w-[617px] h-[181px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    placeholder="Cuerpo de texto"
                    name="description"
                    onChange={handlerChange}
                    value={data.description}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10">
              <button
                type="button"
                onClick={() => setModalCreateNotice(false)}
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
      <div
        onClick={() => setModalCreateNotice(true)}
        className="w-[306px] h-[200px] flex border-[1px] rounded-[13px] border-expresscash-gray items-center justify-center cursor-pointer"
      >
        <IconMas />
      </div>
    </>
  );
};

export default CreateNotice;
