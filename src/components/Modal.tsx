import React from "react";
import ReactDOM from "react-dom";

const Modal = ({
  isShown,
  closeModal,
  element,
}: {
  isShown: boolean;
  closeModal?: (prop: boolean) => void;
  element: React.ReactNode;
}) => {
  const modal = document.getElementById("modal");

  if (!modal) return null;

  return isShown
    ? ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={() => closeModal && closeModal(false)}
          ></div>
          <div className="relative bg-white overflow-y-auto max-h-[100%] journal-scroll rounded-[13px]">
            {element}
          </div>
        </div>,
        modal
      )
    : null;
};

export default Modal;


//dsadsad