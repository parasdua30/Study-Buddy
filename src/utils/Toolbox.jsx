import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { COLORS, MENU_ITEMS } from "../constants";
import styles from "./Toolbox.module.css";
import { changeBrushSize, changeColor } from "../redux/reducers/toolboxSlice";
import { useSocket } from "../Socket";

function Toolbox() {
    const socket = useSocket();
    const dispatch = useDispatch();
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
    const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
    const showBrushToolOption =
        activeMenuItem === MENU_ITEMS.PENCIL ||
        activeMenuItem === MENU_ITEMS.ERASER;

    const { color, size } = useSelector(
        (state) => state.toolbox[activeMenuItem]
    );

    const updateBrushSize = (e) => {
        dispatch(
            changeBrushSize({ item: activeMenuItem, size: e.target.value })
        );
        socket.emit("changeConfig", { color, size: e.target.value });
    };

    const updateColor = (newColor) => {
        dispatch(changeColor({ item: activeMenuItem, color: newColor }));
        socket.emit("changeConfig", { color: newColor, size });
    };

    return (
        <div className={styles.toolboxContainer}>
            {showStrokeToolOption && (
                <div className={styles.toolItem}>
                    <h4 className={styles.toolText}>BRUSH Color</h4>
                    <div className={styles.itemContainer}>
                        <div
                            className={cx(styles.colorBox, {
                                [styles.active]: color === COLORS.WHITE,
                            })}
                            style={{ backgroundColor: COLORS.WHITE }}
                            onClick={() => updateColor(COLORS.WHITE)}
                        />
                        <div
                            className={cx(styles.colorBox, {
                                [styles.active]: color === COLORS.RED,
                            })}
                            style={{ backgroundColor: COLORS.RED }}
                            onClick={() => updateColor(COLORS.RED)}
                        />
                        <div
                            className={cx(styles.colorBox, {
                                [styles.active]: color === COLORS.GREEN,
                            })}
                            style={{ backgroundColor: COLORS.GREEN }}
                            onClick={() => updateColor(COLORS.GREEN)}
                        />
                        <div
                            className={cx(styles.colorBox, {
                                [styles.active]: color === COLORS.ORANGE,
                            })}
                            style={{ backgroundColor: COLORS.ORANGE }}
                            onClick={() => updateColor(COLORS.ORANGE)}
                        />
                    </div>
                </div>
            )}

            {showBrushToolOption && (
                <div className={styles.toolItem}>
                    <h4 className={styles.toolText}>
                        {activeMenuItem === "PENCIL"
                            ? "BRUSH Size"
                            : `${activeMenuItem} Size`}
                    </h4>
                    <div className={styles.itemContainer}>
                        <input
                            type="range"
                            min={1}
                            max={activeMenuItem === MENU_ITEMS.ERASER ? 50 : 20}
                            step={1}
                            onChange={updateBrushSize}
                            value={size}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Toolbox;
