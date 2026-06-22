import React from "react";

function Loader() {
    return (
        <div style={styles.overlay}>
            <div style={styles.loader}>
                <div style={styles.track}>
                    <div style={styles.line}></div>
                </div>
            </div>

            <style>
                {`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
            </style>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        background: "#161616", // 👈 blocks everything
        zIndex: 9999,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    loader: {
        width: "160px",
    },

    track: {
        width: "100%",
        height: "3px",
        background: "#2a2a2a",
        overflow: "hidden",
        borderRadius: "2px",
    },

    line: {
        width: "40%",
        height: "100%",
        background: "var(--primary-color)",
        boxShadow: "0 0 8px rgba(255,255,255,0.6)",
        animation: "slide 0.8s infinite ease-in-out",
    },
};

export default Loader;