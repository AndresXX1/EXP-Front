import { ArrowLeft } from "@utils/svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardBranch from "./CardBranch";
import { getBranches } from "@store/services/branches";
import CreateBranch from "./CreateBranch";

export interface Branch {
  id: number;
  name: string;
  image: string;
  address: string;
  schedules_1: string;
  schedules_2: string;
  whatsapp: string;
  phone: string;
  url: string;
}

const EditBranches = () => {
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Branch[]>([]);

  const getBranchesList = async () => {
    const response = await getBranches();
    setBranches(response);
  };

  useEffect(() => {
    getBranchesList();
  }, []);
  return (
    <div className="flex flex-col pl-16 pt-12 px-10 min-h-[100%] max-w-[clamp(1100px,77.2vw,1200px)]">
      <div className="flex gap-10 items-center pb-12">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/edit-content")}
        />
        <p className="text-[40px] text-expresscash-textos font-book">
          Sucursales
        </p>
      </div>
      <p className="text-[23px] font-bold text-expresscash-textos mb-6">
        Sucursales
      </p>

      <div className="flex gap-5 flex-wrap">
        {branches.map(branch => {
          return (
            <CardBranch
              key={branch.id}
              branch={branch}
              getBranchesList={getBranchesList}
            />
          );
        })}
        <CreateBranch getBranchesList={getBranchesList} />
      </div>
    </div>
  );
};

export default EditBranches;
