import { useEffect, useState } from "react"
import Wave from "../../components/Canvas/Wave/Wave"
import SignPage from "./SignPage"
import styles from "./SignParentPage.module.css"
import { useCustomWidthHeight } from "../../hooks/custom/useCustomWidthHeight"
import { useRef } from "react"

function SignParentPage() {
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const pageRef = useRef(null)
  /* eslint-disable */
  useEffect(
    function () {
      setCanvasHeight(window.innerHeight)
      setCanvasWidth(window.innerWidth)
    },
    [window.innerHeight, window.innerWidth]
  )
  useCustomWidthHeight(pageRef) //, setCanvasWidth, setCanvasHeight
  return (
    <>
      <div className={`${styles["wave-container"]}`}>
        <Wave canvasHeight={canvasHeight} canvasWidth={canvasWidth} />
      </div>
      <SignPage pageRef={pageRef} />
    </>
  )
}

export default SignParentPage
