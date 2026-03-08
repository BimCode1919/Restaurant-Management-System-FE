import React from "react"
import KitchenSidebar from "../components/KitchenSidebar"
import KitchenHeader from "../components/KitchenHeader"
import OrderColumn from "../components/OrderColumn"
import { useKitchenOrders } from "../hooks/useKitchenOrders"
import InventoryTab from "../components/InventoryTab"

type KitchenTab = "ACTIVE" | "INVENTORY";

const KitchenPage: React.FC<{ store: any }> = ({ store }) => {
  const { preparingOrders, readyOrders, refresh } = useKitchenOrders(store);
  const [activeTab, setActiveTab] = React.useState<KitchenTab>("ACTIVE")

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
      <KitchenSidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={store.logout} />

      <div className="flex-1 flex flex-col">
        <KitchenHeader />

        <main className="flex-1 flex p-8 gap-8 overflow-x-hidden bg-gradient-to-b from-[#0A0A0A] to-[#111111]">
          {activeTab === "ACTIVE" && (
            <>
              <OrderColumn title="Preparing" orders={preparingOrders} type="PREPARING" store={store} refresh={refresh} />
              <OrderColumn title="Ready" orders={readyOrders} type="READY" store={store} refresh={refresh} />
            </>
          )}

          {/* HIỂN THỊ COMPONENT KHO Ở ĐÂY */}
          {activeTab === "INVENTORY" && (
            <div className="flex-1 flex flex-col">
              <div className="mb-8 shrink-0">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Stock Control</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Ingredient Monitoring</p>
              </div>
              <InventoryTab />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default KitchenPage