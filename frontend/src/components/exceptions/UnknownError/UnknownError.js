import React from "react";
import UnknownErrorSVG from "../../../media/svg/Exceptions/UnknownErrorSVG";

export default function RouteNotFound() {
    return (
        <>
            <UnknownErrorSVG />
            <p>Неизвестная ошибка</p>
        </>
    )
}