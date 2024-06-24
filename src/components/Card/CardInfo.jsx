import React from "react";
import { Card } from "flowbite-react";

import img01 from '../../assets/img_upe_01.jpg'

const CardInfo = () => {
    return (
        <Card className="max-w-xl" imgSrc={img01} horizontal>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sistema de Gestión de Extensión Universitaria 2024
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                Sistema desarrollado por los alumnos de la carrera de Ciencias de la Computación de la UPE.
            </p>
        </Card>
    );
}

export default CardInfo;