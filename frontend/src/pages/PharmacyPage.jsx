import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { getPharmacyById } from "../api.js";
import { ProductCard } from "../components/ProductCard.jsx";

export function PharmacyPage({ onNavigate, pharmacyId, onAddToCart }) {
  const [pharmacy, setPharmacy] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pharmacyId) {
      console.log(`Buscando dados da farmácia com ID: ${pharmacyId}`);
      setIsLoading(true);
      getPharmacyById(pharmacyId)
        .then((response) => {
          setPharmacy(response.data.details);
          setProducts(response.data.products);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da farmácia:", error);
          setIsLoading(false);
        });
    }
  }, [pharmacyId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando dados da farmácia...
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Farmácia não encontrada</h2>
        <button
          onClick={() => onNavigate("home")}
          className="text-farmalink-blue mt-4"
        >
          Voltar para a Home
        </button>
      </div>
    );
  }

  const categories = [
    "Medicamentos",
    "Beleza e Higiene",
    "Vitaminas",
    "Mamãe e Bebê",
    "Ofertas",
    "Cuidados Pessoais",
  ];

  return (
    <div className="bg-farmalink-body min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center text-farmalink-blue mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          Voltar para Home
        </button>

        {/* Cabeçalho da Farmácia */}
        <header className="flex items-center gap-8 mb-8">
          <img
            src={pharmacy.image}
            alt={pharmacy.name}
            className="w-40 h-40 rounded-full bg-gray-200 border-4 border-white shadow-md"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/160x160/e0f2fe/0c4a6e?text=Logo")
            }
          />
          <h1 className="text-5xl font-bold text-farmalink-dark">
            {pharmacy.name}
          </h1>
        </header>

        {/* Categorias Horizontais (Fictícias) */}
        <nav className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Categorias</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className="py-3 px-6 bg-white rounded-full shadow-md text-farmalink-blue font-semibold whitespace-nowrap hover:bg-gray-100"
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Conteúdo Principal (Corredores e Produtos) */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna Esquerda: Corredores (Fictícia) */}
          <aside className="w-full md:w-1/4">
            <div className="bg-farmalink-blue text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Corredores</h3>
              <nav className="flex flex-col space-y-3">
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href="#"
                    className="py-2 px-3 rounded-md hover:bg-farmalink-blue-dark transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Coluna Direita: Produtos */}
          <main className="w-full md:w-3/4">
            <h2 className="text-3xl font-bold text-farmalink-dark mb-6">
              Medicamentos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <p className="text-farmalink-gray col-span-full">
                  Esta farmácia ainda não tem produtos cadastrados.
                </p>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{ ...product, pharmacy_name: pharmacy.name }} // Adiciona o nome da farmácia ao produto
                    onAddToCart={onAddToCart}
                    onNavigate={onNavigate}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
