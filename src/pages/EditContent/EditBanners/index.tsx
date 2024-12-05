import { SetStateAction, useEffect, useState } from "react";
import {
  getBannersArgenCompras,
  getBannersCuponizate,
  getBannersHome,
} from "@store/services/banners";
import CardBanner from "./CardBanner";
import { useNavigate } from "react-router-dom";
import UploadBanner from "./UploadBanner";

export interface Banner {
  id: string;
  url: string;
  type: string;
}

const EditBanners = () => {
  const [bannersHome, setBannersHome] = useState<Banner[]>([]);
  const [bannersCuponizate, setBannersCuponizate] = useState<Banner[]>([]);
  const [bannersArgenCompras, setBannersArgenCompras] = useState<Banner[]>([]);
  const [homeIndex, setHomeIndex] = useState(0);
  const [cuponizateIndex, setCuponizateIndex] = useState(0);
  const [argenComprasIndex, setArgenComprasIndex] = useState(0);

  const navigate = useNavigate();

  const getBannersListHome = async () => {
    const bannersHome = await getBannersHome();
    setBannersHome(bannersHome);
  };

  const getBannersListArgenCompras = async () => {
    const bannersArgenCompras = await getBannersArgenCompras();
    console.log("Banners ArgenCompras:", bannersArgenCompras); // Verifica que los banners se reciban correctamente
    setBannersArgenCompras(bannersArgenCompras);
  };

  const getBannersListCuponizate = async () => {
    const bannersCuponizate = await getBannersCuponizate();
    console.log("Banners Cuponizate:", bannersCuponizate); // Verifica que los banners se reciban correctamente
    setBannersCuponizate(bannersCuponizate);
  };

  useEffect(() => {
    getBannersListHome();
    getBannersListCuponizate();
    getBannersListArgenCompras();
  }, []);

  const handlePrev = (
    index: number,
    setIndex: { (value: SetStateAction<number>): void },
    banners: Banner[]
  ) => {
    setIndex(index > 0 ? index - 1 : banners.length - 1); // Modified to avoid errors when index is 0
  };

  const handleNext = (
    index: number,
    setIndex: { (value: SetStateAction<number>): void },
    banners: Banner[]
  ) => {
    setIndex(index < banners.length - 1 ? index + 1 : 0); // Modified to allow circular navigation
  };

  return (
    <div className="flex flex-col pl-16 pt-12 px-10 h-[100%]">
      <div className="flex gap-10 items-center pb-12">
        <button
          onClick={() => navigate("/dashboard/edit-content")}
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
        >
          ←
        </button>
        <p className="text-[40px] text-expresscash-textos font-book">Banners</p>
      </div>

      {/* Home banner */}
      <p className="text-[23px] font-bold text-expresscash-textos mb-6">
        Home banner
      </p>
      <div className="flex items-center gap-3">
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() => handlePrev(homeIndex, setHomeIndex, bannersHome)}
        >
          ←
        </button>
        <div className="grid grid-cols-2 gap-5">
          {bannersHome.slice(homeIndex, homeIndex + 2).map(banner => (
            <CardBanner
              key={banner.id}
              banner={banner}
              getBannersList={getBannersListHome}
              type="home"
            />
          ))}
        </div>
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() => handleNext(homeIndex, setHomeIndex, bannersHome)}
        >
          →
        </button>
        <UploadBanner
          getBannersList={getBannersListHome} // Pass function to refresh home banners
          type="home"
        />
      </div>

      {/* ArgenCompras banner */}
      <p className="text-[23px] font-bold text-expresscash-textos mb-6 mt-6">
        ArgenCompras banner
      </p>
      <div className="flex items-center gap-3">
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() =>
            handlePrev(
              argenComprasIndex,
              setArgenComprasIndex,
              bannersArgenCompras
            )
          }
        >
          ←
        </button>
        <div className="grid grid-cols-2 gap-5">
          {bannersArgenCompras
            .slice(argenComprasIndex, argenComprasIndex + 2)
            .map(banner => (
              <CardBanner
                key={banner.id}
                banner={banner}
                getBannersList={getBannersListArgenCompras}
                type="argencompras"
              />
            ))}
        </div>
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() =>
            handleNext(
              argenComprasIndex,
              setArgenComprasIndex,
              bannersArgenCompras
            )
          }
        >
          →
        </button>
        <UploadBanner
          getBannersList={getBannersListArgenCompras} // Pass function to refresh argencompras banners
          type="argencompras"
        />
      </div>

      {/* Cuponizate banner */}
      <p className="text-[23px] font-bold text-expresscash-textos mb-6 mt-6">
        Cuponizate banner
      </p>
      <div className="flex items-center gap-3">
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() =>
            handlePrev(cuponizateIndex, setCuponizateIndex, bannersCuponizate)
          }
        >
          ←
        </button>
        <div className="grid grid-cols-2 gap-5">
          {bannersCuponizate
            .slice(cuponizateIndex, cuponizateIndex + 2)
            .map(banner => (
              <CardBanner
                key={banner.id}
                banner={banner}
                getBannersList={getBannersListCuponizate}
                type="cuponizate"
              />
            ))}
        </div>
        <button
          className="p-3 bg-gray-200 text-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:bg-[#A3D8F3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3D8F3] focus:ring-offset-2"
          onClick={() =>
            handleNext(cuponizateIndex, setCuponizateIndex, bannersCuponizate)
          }
        >
          →
        </button>
        <UploadBanner
          getBannersList={getBannersListCuponizate} // Pass function to refresh cuponizate banners
          type="cuponizate"
        />
      </div>
    </div>
  );
};

export default EditBanners;
