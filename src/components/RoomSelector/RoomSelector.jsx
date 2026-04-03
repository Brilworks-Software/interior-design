import { rooms } from "../../data/rooms";
import { demoBedroom, demoLivingRoom } from "../../data/demoDesigns";
import RoomCard from "./RoomCard";
import useDesignerStore from "../../store/useDesignerStore";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatPanel from "../Chat/ChatPanel";
import Header from "../Header/Header";

const regularRooms = rooms.filter((r) => r.type !== "kitchen");
const kitchenRooms = rooms.filter((r) => r.type === "kitchen");

export default function RoomSelector() {
  const setRoom = useDesignerStore((s) => s.setRoom);
  const loadDemo = useDesignerStore((s) => s.loadDemo);
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      {/* <Header /> */}

      {/* Demo Buttons */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-2">
        <button
          onClick={() => {
            loadDemo(demoBedroom);
            navigate("/demo/bedroom");
          }}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
        >
          Demo Bedroom
        </button>
        <button
          onClick={() => {
            loadDemo(demoLivingRoom);
            navigate("/demo/living-room");
          }}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
        >
          Demo Living Room
        </button>
      </div>

      <main className="flex-1 overflow-y-auto px-8 py-8 w-full">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Rooms section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Select a Room
              </h2>
              <p className="text-gray-500 mt-1">
                Pick a preset room to begin — you can furnish and customise it
                from there.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              <button
                onClick={() => navigate("/custom")}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-primary transition-all p-6 min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Plus size={20} className="text-secondary" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700">
                    Custom Room
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Set shape, dimensions, doors & windows
                  </div>
                </div>
              </button>
              {regularRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={(r) => {
                    setRoom(r);
                    navigate("/design");
                  }}
                />
              ))}
            </div>
          </section>

          {/* Kitchen section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Select a Kitchen
              </h2>
              <p className="text-gray-500 mt-1">
                Choose a kitchen layout and add appliances, counters, and more.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {kitchenRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={(r) => {
                    setRoom(r);
                    navigate("/design");
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer with Resources
      <footer className="bg-white border-t border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Resources</p>
              <p className="text-xs text-gray-500 mt-1">
                Grow your network and earn rewards
              </p>
            </div>
            <button
              onClick={() => navigate("/affiliate")}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Become an Affiliate
            </button>
          </div>
        </div>
      </footer> */}

      <ChatPanel />
    </div>
  );
}
