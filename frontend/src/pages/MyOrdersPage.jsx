import { useState, useEffect } from "react";
import { getUserOrders } from "../api.js";
import { Package } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-800";
    case "APROVADO":
      return "bg-blue-100 text-blue-800";
    case "EMBALADO":
      return "bg-indigo-100 text-indigo-800";
    case "ENVIADO":
      return "bg-green-100 text-green-800";
    case "CANCELADO":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function MyOrdersPage({ onNavigate, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setError("Você precisa estar logado para ver seus pedidos.");
      setIsLoading(false);
      setTimeout(() => onNavigate("login"), 2000);
      return;
    }

    setIsLoading(true);
    getUserOrders(currentUser.id)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos do utilizador:", err);
        setError("Não foi possível carregar seus pedidos.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser, onNavigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        A carregar os seus pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-farmalink-dark mb-8">
        Meus Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package size={64} className="mx-auto text-farmalink-gray mb-4" />
          <h3 className="text-2xl font-semibold mb-2">
            Você ainda não fez nenhum pedido.
          </h3>
          <p className="text-farmalink-gray mb-6">
            Todos os seus pedidos aparecerão aqui.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="bg-farmalink-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-farmalink-blue-dark transition-colors"
          >
            Começar a comprar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString(
              "pt-PT"
            );
            return (
              <div
                key={order.orderId}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <header className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div>
                    <h3 className="font-bold text-farmalink-dark">
                      Pedido #{order.orderId}
                    </h3>
                    <p className="text-sm text-farmalink-gray">
                      Feito em: {formattedDate}
                    </p>
                  </div>
                  <span
                    className={`font-semibold py-1 px-3 rounded-full text-sm ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </header>
                <div className="p-4">
                  <p className="font-semibold mb-2">Itens:</p>
                  <div className="text-farmalink-gray space-y-1">
                    {order.items.split("; ").map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                  </div>
                  <div className="text-right text-2xl font-bold text-farmalink-dark mt-4">
                    Total: R$
                    {Number(order.total_price).toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
