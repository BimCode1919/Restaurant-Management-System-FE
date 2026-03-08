const KitchenHeader = () => {

  return (

    <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-slate-900">

      <div>

        <h1 className="text-2xl font-black uppercase">
          Main Kitchen Station
        </h1>

        <p className="text-xs text-gray-500">
          Station 01 • Active
        </p>

      </div>

      <div className="text-right">

        <p className="text-3xl font-black">

          {new Date().toLocaleTimeString([], {
            hour:"2-digit",
            minute:"2-digit"
          })}

        </p>

      </div>

    </header>

  )
}

export default KitchenHeader