import React, { memo, useEffect, useRef, useState } from "react";

function DisplayOdd({ odd, rate, oddtype }) {

    const prevOdd = useRef(undefined);
    const prevRate = useRef(undefined);
    const [animate, setAnimate] = useState(false);
    let changeStyle = "";
    if (oddtype === "b") {
        changeStyle = "backRateStyle";
    }
    if (oddtype === "l") {
        changeStyle = "layRateStyle";
    }

    useEffect(() => {
        const curr = odd;
        if (prevOdd.current !== undefined && prevOdd.current !== curr) {
            // restart the CSS animation by toggling the class
            setAnimate(false);
            // following function is a browser api which runs right before the next repaint(re loading)
            // check https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
            const raf = requestAnimationFrame(() => setAnimate(true));
            return () => cancelAnimationFrame(raf); // cancelling the animation frame
        }
        prevOdd.current = curr;
    }, [odd]);

    useEffect(() => {
        const curr = rate;
        if (prevRate.current !== undefined && prevRate.current !== curr) {
            // restart the CSS animation by toggling the class
            setAnimate(false);
            // following function is a browser api which runs right before the next repaint(re loading)
            // check https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
            const raf = requestAnimationFrame(() => setAnimate(true));
            return () => cancelAnimationFrame(raf); // cancelling the animation frame
        }
        prevRate.current = curr;
    }, [rate]);



    return (
        <div className={`${animate ? changeStyle : ""}`}>
            <span className="price-odd" style={{ fontSize: "19px" }}>{odd}</span>
            <span className="price-amount">{rate}</span>
        </div>
    );
}


export default memo(DisplayOdd, (prev, next) => {

    return prev.odd === next.odd && prev.rate === next.rate;
});
