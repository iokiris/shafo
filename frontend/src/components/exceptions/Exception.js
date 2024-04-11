import React from "react";
import exceptionsRoad from "./exceptionsRoad";
import UnknownError from './UnknownError/UnknownError'
import './Exception.css'
import CentralizedBox from "../box/CentralizedBox/CentralizedBox";

export default function Exception( {type} ) {
    const ExceptionComponent = exceptionsRoad[type] || UnknownError;
    return (
        <CentralizedBox>
            <ExceptionComponent />
            <a href="/">На главную</a>
        </CentralizedBox>
        
    )
}