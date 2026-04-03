import { useEffect } from "react";
import { demoBedroom, demoLivingRoom } from "../../data/demoDesigns";
import useDesignerStore from "../../store/useDesignerStore";
import DesignerLayout from "./DesignerLayout";

export default function DemoDesigner({ demo = "bedroom" }) {
  const loadDemo = useDesignerStore((s) => s.loadDemo);

  useEffect(() => {
    if (demo === "bedroom") loadDemo(demoBedroom);
    else loadDemo(demoLivingRoom);
  }, [demo, loadDemo]);

  return <DesignerLayout />;
}
