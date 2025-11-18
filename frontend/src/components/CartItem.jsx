export function CartItem({ item, onUpdateQuantity, onRemoveFromCart }) {
  const priceAsNumber = Number(item.price) || 0;
  const itemTotal = priceAsNumber * item.quantity;

  return (
    <div className="grid grid-cols-5 gap-4 p-4 items-center border-b">
      {/* Item */}
      <div className="col-span-2 flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded-md object-cover bg-gray-100"
        />
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-sm text-farmalink-gray">{item.pharmacy_name}</p>
        </div>
      </div>

      {/* Preço */}
      <div className="text-farmalink-gray">
        R${priceAsNumber.toFixed(2).replace(".", ",")}
      </div>

      {/* Quantidade */}
      <div>
        <div className="flex items-center border rounded-lg w-fit">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1 text-lg"
          >
            -
          </button>
          <span className="px-4 py-1 border-x">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Preço Total */}
      <div className="font-semibold">
        R${itemTotal.toFixed(2).replace(".", ",")}
      </div>

      {/* Ações (Remover) - escondido em telas maiores, ajustado para móvel */}
      <button
        onClick={() => onRemoveFromCart(item.id)}
        className="absolute right-4 md:relative text-farmalink-gray hover:text-red-500"
      >
        &times;
      </button>
    </div>
  );
}
