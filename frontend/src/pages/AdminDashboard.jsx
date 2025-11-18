import { useState } from "react";
import { AdminOrders } from "./AdminOrders.jsx";
import { AdminProducts } from "./AdminProducts.jsx";
import { AdminUsers } from "./AdminUsers.jsx";

export function AdminDashboard({ onNavigate }) {
  const [currentTab, setCurrentTab] = useState("orders");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-farmalink-dark mb-8">
        Painel de Administração
      </h1>

      {/* Navegação do Admin (com abas) */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setCurrentTab("orders")}
          className={`py-3 px-5 font-semibold ${
            currentTab === "orders"
              ? "border-b-4 border-farmalink-blue text-farmalink-blue"
              : "text-farmalink-gray hover:text-farmalink-dark"
          }`}
        >
          Gestão de Pedidos
        </button>
        <button
          onClick={() => setCurrentTab("products")}
          className={`py-3 px-5 font-semibold ${
            currentTab === "products"
              ? "border-b-4 border-farmalink-blue text-farmalink-blue"
              : "text-farmalink-gray hover:text-farmalink-dark"
          }`}
        >
          Gestão de Produtos
        </button>
        <button
          onClick={() => setCurrentTab("users")}
          className={`py-3 px-5 font-semibold ${
            currentTab === "users"
              ? "border-b-4 border-farmalink-blue text-farmalink-blue"
              : "text-farmalink-gray hover:text-farmalink-dark"
          }`}
        >
          Gestão de Utilizadores
        </button>
      </div>

      {/* Conteúdo da Aba Selecionada */}
      <div>
        {currentTab === "orders" && <AdminOrders />}
        {currentTab === "products" && <AdminProducts />}
        {currentTab === "users" && <AdminUsers />}
      </div>
    </div>
  );
}
