import { useState, useEffect } from "react";
import { getAdminOrders, updateOrderStatus } from "../api.js";

function OrderRow({ order, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      await updateOrderStatus(order.orderId, status);
      onStatusChange(order.orderId, status);
      alert(`Status do pedido #${order.orderId} atualizado!`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Falha ao atualizar o status.");
      setStatus(order.status);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = new Date(order.created_at).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="border-b bg-white hover:bg-gray-50">
      <td className="p-4 font-bold text-farmalink-blue">#{order.orderId}</td>
      <td className="p-4 text-farmalink-gray">{formattedDate}</td>
      <td className="p-4 text-farmalink-dark font-medium">
        {/* Divide os itens que vêm como "Produto A (x1); Produto B (x2)" */}
        {order.items.split("; ").map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </td>
      <td className="p-4 font-bold text-lg">
        R${Number(order.total_price).toFixed(2).replace(".", ",")}
      </td>
      <td className="p-4">
        {/* Seletor de Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-farmalink-blue"
        >
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="EMBALADO">Embalado</option>
          <option value="ENVIADO">Enviado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </td>
      <td className="p-4">
        <button
          onClick={handleUpdateStatus}
          disabled={isLoading || status === order.status}
          className="bg-farmalink-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-farmalink-blue-dark transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </td>
    </tr>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminOrders();
      setOrders(response.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar os pedidos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {isLoading ? (
        <p className="p-8 text-center">A carregar pedidos...</p>
      ) : error ? (
        <p className="p-8 text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-farmalink-dark">
                Pedido ID
              </th>
              <th className="p-4 font-semibold text-farmalink-dark">Data</th>
              <th className="p-4 font-semibold text-farmalink-dark">Itens</th>
              <th className="p-4 font-semibold text-farmalink-dark">Total</th>
              <th className="p-4 font-semibold text-farmalink-dark">Status</th>
              <th className="p-4 font-semibold text-farmalink-dark">Ação</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-farmalink-gray">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.orderId}
                  order={order}
                  onStatusChange={handleStatusUpdate}
                />
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
