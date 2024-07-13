import React from "react";

function Options({ selectedOption, onDataReceived }) {
    const handleClick = (buttonName) => {
        onDataReceived(buttonName);
    };

    return (
        <div className="flex m-1">
            <div className="flex items-center mr-4">
                <input
                    type="radio"
                    id="editor"
                    name="options"
                    checked={selectedOption === "editor"}
                    onChange={() => handleClick("editor")}
                    className="form-radio h-4 w-4 text-blue-500"
                />
                <label htmlFor="editor" className="ml-2 text-sm font-medium">
                    Editor
                </label>
            </div>
            <div className="flex items-center mr-4">
                <input
                    type="radio"
                    id="whiteboard"
                    name="options"
                    checked={selectedOption === "whiteboard"}
                    onChange={() => handleClick("whiteboard")}
                    className="form-radio h-4 w-4 text-blue-500"
                />
                <label
                    htmlFor="whiteboard"
                    className="ml-2 text-sm font-medium"
                >
                    WhiteBoard
                </label>
            </div>
            {/* <div className="flex items-center">
                <input
                    type="radio"
                    id="both"
                    name="options"
                    checked={selectedOption === "both"}
                    onChange={() => handleClick("both")}
                    className="form-radio h-4 w-4 text-blue-500"
                />
                <label htmlFor="both" className="ml-2 text-sm font-medium">
                    Both
                </label>
            </div> */}
        </div>
    );
}

export default Options;
