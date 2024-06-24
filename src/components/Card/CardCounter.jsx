import React from "react";

const CardCounter = ({ title, icon, color, total, width, height }) => {
    // Estilo en línea para el tamaño de la tarjeta
    const cardStyle = {
        width: width || "auto", // Si no se proporciona un ancho, se establece en "auto" (valor predeterminado)
        height: height || "auto", // Si no se proporciona un alto, se establece en "auto" (valor predeterminado)
    };

    return (
        <div
            className={`bg-${color}-200 border border-t-4 border-t-${color}-600 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:border-t-${color}-500 dark:shadow-slate-700/[.7]`}
            style={cardStyle}
        >
            <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    <span><i className={`${icon}`}></i></span> {title}
                </h3>
                <p className="mt-2 text-gray-800 dark:text-gray-400 font-bold">
                    Total: {total}
                </p>
            </div>
        </div>
    );
};

export default CardCounter;
