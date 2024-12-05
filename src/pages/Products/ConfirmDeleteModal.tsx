import React, { useState } from "react";
import { IconX } from "@utils/svg";
import Modal from "@components/Modal";
import { deleteProductService } from "../../store/services/productsPoint";

interface ConfirmDeleteModalProps {
  isShown: boolean;
  onClose: () => void;
  productId: number;
  onProductDeleted: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isShown, onClose, productId, onProductDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productId || productId === 0) {
      alert('No se pudo identificar el producto a eliminar');
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteProductService(productId);
      
      if (success) {
        onProductDeleted(); 
        onClose();
      } else {
        alert('Hubo un problema al eliminar el producto');
      }
    } catch (error) {
      alert('Hubo un problema al eliminar el producto');
    } finally {
      setIsDeleting(false); 
    }
  };

  return (
    <Modal isShown={isShown} element={
      <div className="px-6 py-6 flex flex-col justify-center gap-5 w-[481px] h-[192px]">
        <div className="flex justify-between items-center">
          <p className="text-[1rem] text-Express-Cash-textos font-bold">
            ¿Está seguro que desea eliminar este producto?
          </p>
          <p className="cursor-pointer" onClick={onClose}>
            <IconX />
          </p>
        </div>
        <p className="text-[14px] font-book text-Express-Cash-gray w-[380px]">
          Si lo elimina no podrá recuperarlo más adelante.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className={`bg-Express-Cash-red w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            onClick={onClose}
            className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
          >
            Cancelar
          </button>
        </div>
      </div>
    } />
  );
};

export default ConfirmDeleteModal;
