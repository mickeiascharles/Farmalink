import { useState, useEffect } from "react";
import {
  getFeaturedPharmacies,
  getOfferProducts,
  createOrder,
  loginUser,
  registerUser,
} from "./api.js";

import { Header } from "./components/Header.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { ConfirmationPage } from "./pages/ConfirmationPage.jsx";
import { PharmacyPage } from "./pages/PharmacyPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { MyOrdersPage } from "./pages/MyOrdersPage.jsx";
import { SearchResultsPage } from "./pages/SearchResultsPage.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("farmalinkUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState(
    currentUser ? "home" : "login"
  );
  const [pageParam, setPageParam] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [featuredPharmacies, setFeaturedPharmacies] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (currentUser) {
      getFeaturedPharmacies()
        .then((response) => setFeaturedPharmacies(response.data))
        .catch((error) => console.error("Erro ao buscar farmácias:", error));
      getOfferProducts()
        .then((response) => setOfferProducts(response.data))
        .catch((error) => console.error("Erro ao buscar ofertas:", error));
    }
  }, [currentUser]);

  const handleNavigate = (page, param = null) => {
    setCurrentPage(page);
    setPageParam(param);
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = (query) => {
    setSearchTerm(query);
    handleNavigate("searchResults");
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("farmalinkUser", JSON.stringify(user));
    console.log("Utilizador logado:", user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("farmalinkUser");
    handleNavigate("login");
  };

  // --- Funções do Carrinho ---
  const handleAddToCart = (productToAdd, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const renderPage = () => {
    if (currentPage === "login") {
      return (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    if (currentPage === "register") {
      return <RegisterPage onNavigate={handleNavigate} />;
    }

    if (!currentUser) {
      setCurrentPage("login");
      return (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentPage === "adminDashboard") {
      if (currentUser.isAdmin !== 1) {
        handleNavigate("home");
        return (
          <HomePage
            pharmacies={featuredPharmacies}
            products={offerProducts}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        );
      }
      return (
        <>
          <Header
            onNavigate={handleNavigate}
            cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
            currentUser={currentUser}
            onLogout={handleLogout}
            onClearCart={handleClearCart}
            onSearchSubmit={handleSearchSubmit}
          />
          <AdminDashboard onNavigate={handleNavigate} />
        </>
      );
    }

    let pageComponent;
    switch (currentPage) {
      case "home":
        pageComponent = (
          <HomePage
            pharmacies={featuredPharmacies}
            products={offerProducts}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        );
        break;
      case "searchResults":
        pageComponent = (
          <SearchResultsPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            searchTerm={searchTerm}
          />
        );
        break;
      case "cart":
        pageComponent = (
          <CartPage
            cart={cart}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
          />
        );
        break;
      case "checkout":
        pageComponent = (
          <CheckoutPage
            onNavigate={handleNavigate}
            cart={cart}
            onSetOrderId={setOrderId}
            onClearCart={handleClearCart}
            currentUser={currentUser}
          />
        );
        break;
      case "confirmation":
        pageComponent = (
          <ConfirmationPage onNavigate={handleNavigate} orderId={orderId} />
        );
        break;
      case "product":
        pageComponent = (
          <ProductDetailPage
            onNavigate={handleNavigate}
            productId={pageParam}
            onAddToCart={handleAddToCart}
            products={offerProducts}
          />
        );
        break;
      case "pharmacy":
        pageComponent = (
          <PharmacyPage
            onNavigate={handleNavigate}
            pharmacyId={pageParam}
            onAddToCart={handleAddToCart}
          />
        );
        break;
      case "myOrders":
        pageComponent = (
          <MyOrdersPage onNavigate={handleNavigate} currentUser={currentUser} />
        );
        break;
      default:
        pageComponent = (
          <HomePage
            pharmacies={featuredPharmacies}
            products={offerProducts}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
          />
        );
    }

    return (
      <>
        <Header
          onNavigate={handleNavigate}
          cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onClearCart={handleClearCart}
          onSearchSubmit={handleSearchSubmit}
        />
        {pageComponent}
      </>
    );
  };

  return <div className="bg-farmalink-body min-h-screen">{renderPage()}</div>;
}

export default App;
