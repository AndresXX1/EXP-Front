import { IconViewBlue, IconViewBlueOff } from "@utils/svg";
import { IProduct } from ".";
import { changeOfVisibilityProduct } from "@store/services/product";

interface ProductCardProps {
  product: IProduct;
  getProducts: () => void;
}

const ProductCard = ({ product, getProducts }: ProductCardProps) => {
  const toggleVisibility = async () => {
    const response = await changeOfVisibilityProduct(product.id);
    if (response) {
      getProducts();
    }
  };

  console.log("product.image:", product.image);
  return (
    <div
      className={`${product?.status === "activo" ? "max-w-[305px] h-[207px] flex border-[1px] rounded-[13px] border-expresscash-gray mb-10 font-book" : "max-w-[305px] h-[207px] flex border-[1px] rounded-[13px] border-expresscash-gray mb-10 font-book opacity-30"}`}
    >
      <div className="flex flex-col justify-between pt-5  pb-3 pl-4">
        <h4 className="w-[141px] text-[20px] font-book leading-[24px] text-expresscash-textos">
          {product.name}
        </h4>
        <p className="text-expresscash-red text-[20px] font-bold leading-[19px]">
          ${parseInt(product?.value).toLocaleString("es-AR")}
        </p>
      </div>
      <div className="h-full w-[150px] rounded-[13px] bg-[#F9F9F9] flex items-center relative">
        {product.image && (
          <img
            className="w-[150px] h-[150px]"
            src={`https://back7.maylandlabs.com/product/${product.image}`}
            alt={product.name}
          />
        )}
        <div
          onClick={toggleVisibility}
          className="rounded-md absolute bottom-2 flex right-4 cursor-pointer hover:scale-110 transition-all"
        >
          {product?.status === "activo" ? (
            <IconViewBlueOff />
          ) : (
            <IconViewBlue />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
