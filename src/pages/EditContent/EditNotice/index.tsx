import { getNotices } from "@store/services/notices";
import { ArrowLeft } from "@utils/svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardNotice from "../CardNotice";
import CreateNotice from "../CreateNotice";

export interface Notice {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
}

const EditNotice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  const getNoticesList = async () => {
    const notices = await getNotices();
    setNotices(notices);
  };

  useEffect(() => {
    getNoticesList();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col pl-16 pt-12 px-10 min-h-[100%] max-w-[clamp(1100px,77.2vw,1200px)]">
      <div className="flex gap-10 items-center pb-12">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/edit-content")}
        />
        <p className="text-[40px] text-expresscash-textos font-book">
          Noticias
        </p>
      </div>

      <p className="text-[23px] font-bold text-expresscash-textos mt-10 mb-5">
        Noticias
      </p>
      <div className="flex flex-wrap gap-5 pb-12">
        {notices.map(notice => {
          return (
            <CardNotice
              key={notice.id}
              notice={notice}
              getNoticesList={getNoticesList}
            />
          );
        })}
        <CreateNotice getNoticesList={getNoticesList} />
      </div>
    </div>
  );
};

export default EditNotice;
