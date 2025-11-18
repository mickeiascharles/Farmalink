import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";

export function Header({
  onNavigate,
  cartItemCount,
  currentUser,
  onLogout,
  onClearCart,
  onSearchSubmit,
}) {
  const handleLogoutClick = () => {
    onLogout();
    onClearCart();
    onNavigate("login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    if (searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barra Superior */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo de Imagem */}
        <img
          src="/logo-farmalink.png"
          alt="FarmaLink Logo"
          className="h-10 w-auto cursor-pointer"
          onClick={() => onNavigate("home")}
        />

        {/* Barra de Busca (FORM) */}
        <div className="flex-1 mx-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              name="search"
              placeholder="Busque produtos, farmácias ou insira seu CEP"
              className="w-full py-2 px-4 pr-10 border border-farmalink-gray-light rounded-full focus:outline-none focus:ring-2 focus:ring-farmalink-blue"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-farmalink-gray hover:text-farmalink-blue"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Ícones da Direita */}
        <div className="flex items-center space-x-4">
          {/* Link do Admin */}
          {currentUser && currentUser.isAdmin === 1 && (
            <button
              onClick={() => onNavigate("adminDashboard")}
              className="hidden md:flex items-center text-farmalink-blue font-semibold"
            >
              <ShieldCheck size={24} className="mr-1" />
              <span>Painel Admin</span>
            </button>
          )}

          {/* Carrinho */}
          <button
            className="flex items-center text-farmalink-gray relative"
            onClick={() => onNavigate("cart")}
          >
            <ShoppingCart size={24} />
            <span className="hidden md:inline ml-2">Carrinho</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Pedidos */}
          {currentUser && (
            <button
              onClick={() => onNavigate("myOrders")}
              className="hidden md:flex items-center text-farmalink-gray"
            >
              <Package size={24} />
              <span className="ml-2">Pedidos</span>
            </button>
          )}

          {/* Login/Logout */}
          {currentUser ? (
            <button
              onClick={handleLogoutClick}
              className="hidden md:flex items-center text-farmalink-gray"
            >
              <LogOut size={24} className="text-red-500" />
              <span className="ml-2">Sair</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="hidden md:flex items-center text-farmalink-gray"
            >
              <User size={24} />
              <span className="ml-2">Conta</span>
            </button>
          )}
        </div>
      </div>

      {/* A BARRA AZUL DE NAVEGAÇÃO FOI REMOVIDA DAQUI */}
    </header>
  );
}
