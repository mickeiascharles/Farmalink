import { useState } from "react";
import { createOrder } from "../api.js";

export function CheckoutPage({
  onNavigate,
  cart,
  onSetOrderId,
  onClearCart,
  currentUser,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );
  const discount = subtotal > 0 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await createOrder(cart, total, currentUser.id);

      const newOrderId = response.data.orderId;

      onSetOrderId(newOrderId);

      onClearCart();

      onNavigate("confirmation");
    } catch (error) {
      console.error("Falha ao criar o pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-farmalink-dark mb-6">
        Confirmar e pagar
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna Esquerda: Formulário de Pagamento (Fictício) */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Pagamento</h3>
          <p className="text-farmalink-gray mb-6">
            Esta é uma simulação. O protótipo 'Pagamento.png' entraria aqui.
            Vamos apenas confirmar o pedido.
          </p>
          <div>
            <label className="font-semibold">Nome no Cartão</label>
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full p-2 border rounded-lg mt-2"
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="font-semibold">Número do Cartão</label>
            <input
              type="text"
              placeholder="**** **** **** 1234"
              className="w-full p-2 border rounded-lg mt-2"
              disabled
            />
          </div>
        </div>

        {/* Coluna Direita: Resumo do Pedido */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Resumo</h3>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2 text-sm text-farmalink-gray"
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>
                  R${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
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
                <span>Total:</span>
                <span>R${total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <button
              className="w-full bg-farmalink-blue text-white font-bold py-3 rounded-lg mt-6 hover:bg-farmalink-blue-dark transition-colors disabled:bg-gray-400"
              onClick={handleConfirmOrder}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? "Processando..." : "Confirmar e Pagar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
