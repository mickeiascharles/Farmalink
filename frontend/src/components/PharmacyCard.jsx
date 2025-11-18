export function PharmacyCard({ pharmacy, onNavigate }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md min-w-[200px] text-center p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate("pharmacy", pharmacy.id)}
    >
      {/* --- ESTA É A MUDANÇA --- */}
      {/* Ajustado para logos retangulares */}
      <div className="w-full h-32 flex items-center justify-center mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={pharmacy.image}
          alt={pharmacy.name}
          className="w-full h-full object-contain p-2"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/150x150/e0f2fe/0c4a6e?text=Erro")
          }
        />
      </div>
      {/* --- FIM DA MUDANÇA --- */}

      <h3 className="text-lg font-semibold text-farmalink-dark">
        {pharmacy.name}
      </h3>
      <p className="text-sm text-farmalink-gray">Ver produtos</p>
    </div>
  );
}
