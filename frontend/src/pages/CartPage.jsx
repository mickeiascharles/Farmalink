import { ShoppingCart, ChevronLeft } from "lucide-react";
import { CartItem } from "../components/CartItem";

export function CartPage({
  cart,
  onNavigate,
  onUpdateQuantity,
  onRemoveFromCart,
}) {
  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );
  const discount = subtotal > 0 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-farmalink-dark mb-6">Carrinho</h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart
            size={64}
            className="mx-auto text-farmalink-gray mb-4"
          />
          <h3 className="text-2xl font-semibold mb-2">
            Seu carrinho está vazio
          </h3>
          <p className="text-farmalink-gray mb-6">
            Adicione produtos para vê-los aqui.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="bg-farmalink-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-farmalink-blue-dark transition-colors"
          >
            Voltar para a Home
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Itens do Carrinho */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b font-semibold text-farmalink-gray text-sm">
                <span className="col-span-2">Item</span>
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Preço Total</span>
              </div>

              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveFromCart={onRemoveFromCart}
                />
              ))}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Resumo</h3>
              <div className="flex justify-between mb-2">
                <span>Promocode:</span>
                <span className="font-semibold text-green-600">
                  HAPPY (-10%)
                </span>
              </div>
              <div className="flex justify-between mb-2 text-farmalink-gray">
                <span>Subtotal</span>
                <span>R${subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between mb-4 text-farmalink-gray">
                <span>Desconto</span>
                <span className="text-red-500">
                  -R${discount.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center font-bold text-xl">
                <span>Total Price:</span>
                <span>R${total.toFixed(2).replace(".", ",")}</span>
              </div>
              <button
                className="w-full bg-black text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors"
                onClick={() => onNavigate("checkout")}
              >
                Check out
              </button>
            </div>
            <button
              onClick={() => onNavigate("home")}
              className="text-farmalink-blue mt-6 flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
