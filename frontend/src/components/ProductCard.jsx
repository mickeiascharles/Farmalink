import { Star, Plus } from "lucide-react";

export function ProductCard({ product, onAddToCart, onNavigate }) {
  const priceAsNumber = Number(product.price) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div
        className="cursor-pointer"
        onClick={() => onNavigate("product", product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4 bg-gray-100"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/300x300/e0f2fe/0c4a6e?text=Erro")
          }
        />
        <p className="text-xs text-farmalink-gray">{product.pharmacy_name}</p>
        <h3 className="text-md font-semibold text-farmalink-dark my-1 h-12">
          {product.name}
        </h3>
        <div className="flex items-center text-sm my-2">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-farmalink-gray">
            {product.rating} ({product.reviews})
          </span>
        </div>
      </div>

      {/* Parte inferior (Preço e Botão) */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold text-farmalink-dark">
          R${priceAsNumber.toFixed(2).replace(".", ",")}
        </span>
        <button
          className="bg-farmalink-blue text-white rounded-full p-2 hover:bg-farmalink-blue-dark transition-colors"
          onClick={() => onAddToCart(product)}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
