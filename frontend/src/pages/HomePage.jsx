import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../components/ProductCard.jsx";
import { PharmacyCard } from "../components/PharmacyCard.jsx";

export function HomePage({ pharmacies, products, onAddToCart, onNavigate }) {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* --- ESTA É A MUDANÇA --- */}
      {/* Banner Principal (Substituído) */}
      <div className="w-full rounded-lg mb-12 shadow-md overflow-hidden">
        <img
          src="/banner-farmalink.png"
          alt="FarmaLink Banner - Sua Saúde, Seu Clique"
          className="w-full h-auto object-cover"
        />
      </div>
      {/* --- FIM DA MUDANÇA --- */}

      {/* Seção: Farmácias em Destaque */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-farmalink-dark mb-6">
          Farmácias em destaque
        </h2>
        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {pharmacies.length === 0 && <p>Carregando farmácias...</p>}
            {pharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          {/* Botões de Scroll (simplificado) */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Seção: Ofertas */}
      <section>
        <h2 className="text-3xl font-bold text-farmalink-dark mb-6">Ofertas</h2>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.length === 0 && <p>Carregando ofertas...</p>}
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
