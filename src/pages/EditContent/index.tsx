import { IconBanners, IconBranches, IconNotices } from "@utils/svg";
import { useNavigate } from "react-router-dom";

const EditContent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col pl-16 pt-12 px-10 min-h-[100vh]">
      <p className="text-[3rem] text-Express-Cash-textos font-bold pb-12">
        Editar contenido
      </p>

      <div className="grid grid-cols-2 grid-rows-2 gap-8 pb-12">
        <div
          onClick={() => navigate("/dashboard/edit-content/banners")}
          className="flex flex-col gap-1 items-center justify-center border-Express-Cash-gray2 rounded-[12.48px] border-[1px] col-span-1 w-[445px] h-[241px] cursor-pointer transition-all hover:border-Express-Cash-textos"
        >
          <IconBanners />
          <p className="text-[22.08px] text-Express-Cash-textos font-book">
            Banners
          </p>
        </div>
        <div
          onClick={() => navigate("/dashboard/edit-content/notices")}
          className="flex flex-col gap-1 items-center justify-center border-Express-Cash-gray2 rounded-[12.48px] border-[1px] col-span-1 w-[445px] h-[241px] cursor-pointer transition-all hover:border-Express-Cash-textos"
        >
          <IconNotices />
          <p className="text-[22.08px] text-Express-Cash-textos font-book">
            Noticias
          </p>
        </div>
        <div
          onClick={() => navigate("/dashboard/edit-content/branches")}
          className="flex flex-col gap-1 items-center justify-center border-Express-Cash-gray2 rounded-[12.48px] border-[1px] col-span-2 h-[241px] cursor-pointer transition-all hover:border-Express-Cash-textos"
        >
          <IconBranches />
          <p className="text-[22.08px] text-Express-Cash-textos font-book">
            Sucursales
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditContent;
