"use client";

import React, { useEffect, useRef, useState } from "react";

function IntroVideo({ onStartDismiss, onFinish }) {
    const videoRef = useRef();
    const hasTriggered = useRef(false);
    const [slideUp, setSlideUp] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const handleFinish = () => {
            if (hasTriggered.current) return;
            hasTriggered.current = true;

            setSlideUp(true);
            if (onStartDismiss) {
                onStartDismiss();
            }

            setTimeout(() => {
                onFinish();
            }, 1000);
        };

        const handleScroll = () => handleFinish();

        window.addEventListener("wheel", handleScroll);
        window.addEventListener("touchstart", handleScroll);

        const video = videoRef.current;
        if (video) {
            video.onended = handleFinish;
        }

        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchstart", handleScroll);
        };
    }, [onStartDismiss, onFinish]);

    return (
        <div
            style={{
                height: "100dvh",
                width: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,

                background: "#161616", // ✅ your custom color

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                transform: slideUp ? "translateY(-100%)" : "translateY(0)",
                transition: "transform 1.0s cubic-bezier(0.85, 0, 0.15, 1)",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain", // ✅ full video always visible

                    transform: slideUp ? "scale(0.97)" : "scale(1)",
                    filter: slideUp ? "blur(4px)" : "blur(0px)",

                    transition: "transform 1.0s cubic-bezier(0.85, 0, 0.15, 1), filter 1.0s cubic-bezier(0.85, 0, 0.15, 1)",
                }}
            >
                <source src="/intro.mp4" type="video/mp4" />
            </video>

            {/* Overlay Text */}
            <div
                style={{
                    position: "absolute",
                    bottom: "40px",
                    width: "100%",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "14px",
                    letterSpacing: "2px",
                    opacity: slideUp ? 0 : 1,
                    transition: "opacity 0.5s ease",
                }}
            >
                Scroll or Tap to Enter
            </div>
        </div>
    );
}

export default IntroVideo;