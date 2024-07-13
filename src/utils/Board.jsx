import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "../constants";
import { actionItemClick } from "../redux/reducers/menuSlice";
import { useSocket } from "../Socket";

function Board() {
    const canvasRef = useRef(null);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const shouldDraw = useRef(false);
    const dispatch = useDispatch();
    const socket = useSocket();
    const { activeMenuItem, actionMenuItem } = useSelector(
        (state) => state.menu
    );
    const { color, size } = useSelector(
        (state) => state.toolbox[activeMenuItem]
    );

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL();
            const anchor = document.createElement("a");
            anchor.href = URL;
            anchor.download = "explaination.jpg";
            anchor.click();
        } else if (actionMenuItem === MENU_ITEMS.UNDO) {
            if (historyPointer.current > 0) historyPointer.current -= 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);

            socket.emit("undo");
        } else if (actionMenuItem === MENU_ITEMS.REDO) {
            if (historyPointer.current < drawHistory.current.length - 1)
                historyPointer.current += 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);

            socket.emit("redo");
        } else if (actionMenuItem === MENU_ITEMS.CLEAR) {
            const imageData = drawHistory.current[historyPointer.current];
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawHistory.current = [
                ...drawHistory.current.slice(0, historyPointer.current + 1),
                imageData,
            ];
            historyPointer.current = drawHistory.current.length - 1;

            socket.emit("clear");
        }
        dispatch(actionItemClick(null));
    }, [actionMenuItem, dispatch]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Set the background color
        context.fillStyle = "black";

        // Fill the entire canvas with the specified color
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const changeConfig = (color, size) => {
            context.strokeStyle = color;
            context.lineWidth = size;
        };

        const handleChangeConfig = (config) => {
            changeConfig(config.color, config.size);
        };
        changeConfig(color, size);
        socket.on("changeConfig", handleChangeConfig);

        return () => {
            socket.off("changeConfig", handleChangeConfig);
        };
        /*
        const changeConfig = () => {
            context.strokeStyle = color;
            context.lineWidth = size;

            socket.emit("changeConfig", { color, size });
        };

        changeConfig();
        */
    }, [color, size]);

    // Canvas Setup
    // it happens before the browser paint
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const parentElement = canvas.parentElement;
        canvas.width = parentElement.offsetWidth;
        canvas.height = parentElement.offsetHeight;

        // Initialize canvas context settings
        context.strokeStyle = color;
        context.lineWidth = size;

        // Drawing Functions
        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y);
        };

        const drawLine = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        };

        // Handling Drawing
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            const { x, y } = getMousePos(e);
            beginPath(x, y);

            socket.emit("beginPath", { x, y });
        };

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return;
            const { x, y } = getMousePos(e);
            drawLine(x, y);

            socket.emit("drawLine", { x, y });
        };

        const handleMouseUp = () => {
            shouldDraw.current = false;
            const imageData = context.getImageData(
                // (x, y pointer, width, height)
                0,
                0,
                canvas.width,
                canvas.height
            );
            drawHistory.current.push(imageData);
            historyPointer.current = drawHistory.current.length - 1;

            socket.emit("endPath");
        };

        // Socket Event Listeners Handlers
        const handleBeginPath = (data) => {
            const { x, y } = data;
            beginPath(x, y);
        };

        const handleDrawLine = (data) => {
            const { x, y } = data;
            drawLine(x, y);
        };

        const handleEndPath = () => {
            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            drawHistory.current.push(imageData);
            historyPointer.current = drawHistory.current.length - 1;
        };

        const handleUndo = () => {
            if (historyPointer.current > 0) historyPointer.current -= 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
        };

        const handleRedo = () => {
            if (historyPointer.current < drawHistory.current.length - 1)
                historyPointer.current += 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
        };

        const handleClear = () => {
            const imageData = drawHistory.current[historyPointer.current];
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawHistory.current = [
                ...drawHistory.current.slice(0, historyPointer.current + 1),
                imageData,
            ];
            historyPointer.current = drawHistory.current.length - 1;
        };

        // Canvas Event Listners
        canvas.addEventListener("mousedown", handleMouseDown); // Mouse Click Pressed
        canvas.addEventListener("mousemove", handleMouseMove); // Mouse Move
        canvas.addEventListener("mouseup", handleMouseUp); // Mouse Click Released

        // Socket Event Listners
        socket.on("beginPath", handleBeginPath);
        socket.on("drawLine", handleDrawLine);
        socket.on("endPath", handleEndPath);
        socket.on("undo", handleUndo);
        socket.on("redo", handleRedo);
        socket.on("clear", handleClear);
        // socket.on("changeConfig", handleChangeConfig);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);

            socket.off("beginPath", handleBeginPath);
            socket.off("drawLine", handleDrawLine);
            socket.off("endPath", handleEndPath);
            socket.off("undo", handleUndo);
            socket.off("redo", handleRedo);
            socket.off("clear", handleClear);
            // socket.on("changeConfig", handleChangeConfig);
        };
    }, []);

    return <canvas ref={canvasRef}></canvas>;
}

export default Board;
