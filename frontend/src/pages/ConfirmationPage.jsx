export function ConfirmationPage({ onNavigate, orderId }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
      <h2 className="text-3xl font-bold text-farmalink-dark mb-4">
        Thank you for your order!
      </h2>
      <p className="text-lg text-farmalink-gray mb-6">
        Order number is:{" "}
        <span className="font-bold text-farmalink-dark">
          #{orderId || "..."}
        </span>
      </p>
      <p className="text-farmalink-gray mb-8">
        You can track your order in "My Order" section
      </p>

      <div className="flex justify-center gap-4">
        {/* --- ESTA É A MUDANÇA --- */}
        {/* O onClick agora navega para "myOrders" em vez de mostrar um alerta */}
        <button
          onClick={() => onNavigate("myOrders")}
          className="bg-farmalink-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-farmalink-blue-dark transition-colors"
        >
          Visualizar meus pedidos
        </button>
        {/* --- FIM DA MUDANÇA --- */}

        <button
          onClick={() => onNavigate("home")}
          className="bg-white text-farmalink-blue border border-farmalink-blue font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
}
