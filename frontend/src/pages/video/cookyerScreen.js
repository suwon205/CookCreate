import React from "react";
import { useMediaQuery } from "react-responsive";
import CookyerFullScreen from "../../component/Video/Cookyer/CookyerFullScreen";

function CookyerScreen() {
  const isFull = useMediaQuery({
    query: "(min-width: 901px)"
  })
  const isHalf = useMediaQuery({
    query: "(max-width: 900px"
  })

  return (
    <div>
      {isFull && <CookyerFullScreen/>}
      {isHalf && <p>반쪽</p>}
    </div>
  )
}

export default CookyerScreen