import { useState, useEffect } from "react";
import { ChevronLeft, Star } from "lucide-react";
import { getProductById } from "../api";
import { ProductCard } from "../components/ProductCard";

export function ProductDetailPage({
  onNavigate,
  productId,
  onAddToCart,
  products,
}) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      console.log(`Buscando produto com ID: ${productId}`);
      getProductById(productId)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar produto:", error);
        });
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando produto...
      </div>
    );
  }

  // Formata o preço
  const priceAsNumber = Number(product.price) || 0;

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    onNavigate("cart");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center text-farmalink-blue mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para Home
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna da Imagem */}
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-white border border-gray-200"
          />
        </div>

        {/* Coluna de Informações e Ações */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Informações do Produto */}
          <div>
            <h2 className="text-3xl font-bold text-farmalink-dark">
              {product.name}
            </h2>
            <p className="text-lg text-farmalink-gray mt-2">
              Vendido por:
              <span
                className="text-farmalink-blue font-semibold cursor-pointer"
                onClick={() => onNavigate("pharmacy", product.pharmacy_id)}
              >
                {product.pharmacy_name}
              </span>
            </p>
            <div className="flex items-center text-sm my-4">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-farmalink-gray">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            {/* Descrição Fictícia */}
            <p className="text-farmalink-gray mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Proin consequat, erat et facilisis maximus, nunc erat
              blandit erat, nec interdum lectus dui vitae sem.
            </p>
          </div>

          {/* Bloco de Ação (Comprar) */}
          <div className="bg-gray-100 rounded-lg p-6 mt-6 md:mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-3xl font-bold text-farmalink-dark">
                R${priceAsNumber.toFixed(2).replace(".", ",")}
              </span>
              {/* Seletor de Quantidade */}
              <div className="flex items-center border rounded-lg bg-white w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 text-xl"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="w-full bg-farmalink-blue text-white font-bold py-3 rounded-lg hover:bg-farmalink-blue-dark transition-colors"
              onClick={handleAddToCartClick}
            >
              Adicionar ao carrinho
            </button>
            <button className="w-full bg-gray-200 text-farmalink-dark font-bold py-3 rounded-lg mt-3 hover:bg-gray-300 transition-colors">
              Comprar
            </button>

            {/* Calcular Frete Fictício */}
            <div className="mt-6">
              <label className="font-semibold text-sm mb-2 block">
                Insira seu CEP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  className="flex-1 p-2 border rounded-lg"
                />
                <button className="bg-gray-700 text-white font-semibold px-4 rounded-lg hover:bg-black">
                  Calcular
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados (usando as ofertas como exemplo) */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-farmalink-dark mb-6">
          Produtos relacionados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Apenas como exemplo, vamos mostrar os 3 primeiros produtos de oferta */}
          {/* Idealmente, seria outra chamada de API */}
          {products &&
            products
              .slice(0, 5)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
