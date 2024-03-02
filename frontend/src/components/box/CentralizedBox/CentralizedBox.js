import React from "react";
import './CentralizedBox.css'
function CentralizedBox({children}) {
    return (
        <div className="centralized-box">
            {children}
        </div>
    )
}

export default CentralizedBox;