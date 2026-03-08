import { OrderItem as Item } from "../types"

const OrderItem:React.FC<{item:Item}> = ({item}) => {

  return (
    <div className="flex gap-3 items-start">

      <div className="size-7 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cheese">
        {item.quantity}x
      </div>

      <div>
        <p className="text-lg font-bold">{item.name}</p>

        {item.note && (
          <p className="text-xs text-gray-400 italic">
            {item.note}
          </p>
        )}
      </div>

    </div>
  )
}

export default OrderItem