import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { searchProducts } from "../api.js";
import { ProductCard } from "../components/ProductCard.jsx";

export function SearchResultsPage({ onNavigate, searchTerm, onAddToCart }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchTerm) {
      setError("Nenhum termo de pesquisa fornecido.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchProducts(searchTerm)
      .then((response) => {
        setResults(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os resultados da pesquisa.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center text-farmalink-blue mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para Home
      </button>

      <h1 className="text-3xl font-bold text-farmalink-dark mb-6">
        Resultados para: "{searchTerm}"
      </h1>

      {isLoading ? (
        <p className="text-center text-farmalink-gray">
          A carregar resultados...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-center text-farmalink-gray">
          Nenhum produto encontrado com este nome.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
