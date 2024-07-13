import React, { useEffect, useState } from "react";
import Board from "../utils/Board";
import Menu from "../utils/Menu";
import Toolbox from "../utils/Toolbox";
import { useSocket } from "../Socket";

function WhiteBoard() {
    return (
        // <div className="flex flex-col justify-center items-center h-full">
        <div className="h-full relative">
            <Menu />
            <Toolbox />
            <div className="bg-black h-full w-full rounded-lg border border-white relative">
                <Board />
            </div>
        </div>
    );
}

export default WhiteBoard;
