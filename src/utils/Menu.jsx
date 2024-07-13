import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaintbrush,
    faEraser,
    faRotateLeft,
    faRotateRight,
    faFileArrowDown,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import styles from "./Menu.module.css";
import { MENU_ITEMS } from "../constants";
import { menuItemClick, actionItemClick } from "../redux/reducers/menuSlice";

function Menu() {
    const dispatch = useDispatch();
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

    const handleMenuClick = (menuItem) => {
        dispatch(menuItemClick(menuItem));
    };

    const handleActionItemClick = (actionItem) => {
        console.log(actionItem);
        dispatch(actionItemClick(actionItem));
    };

    return (
        <div className={styles.menuContainer}>
            <div
                className={cx(styles.iconWrapper, {
                    [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
                })}
                onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
            >
                <FontAwesomeIcon icon={faPaintbrush} className={styles.icon} />
            </div>
            <div
                className={cx(styles.iconWrapper, {
                    [styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
                })}
                onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
            >
                <FontAwesomeIcon icon={faEraser} className={styles.icon} />
            </div>
            <div
                className={styles.iconWrapper}
                onClick={() => handleActionItemClick(MENU_ITEMS.UNDO)}
            >
                <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
            </div>
            <div
                className={styles.iconWrapper}
                onClick={() => handleActionItemClick(MENU_ITEMS.REDO)}
            >
                <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
            </div>
            <div
                className={styles.iconWrapper}
                onClick={() => handleActionItemClick(MENU_ITEMS.DOWNLOAD)}
            >
                <FontAwesomeIcon
                    icon={faFileArrowDown}
                    className={styles.icon}
                />
            </div>
            <div
                className={styles.iconWrapper}
                onClick={() => handleActionItemClick(MENU_ITEMS.CLEAR)}
            >
                <FontAwesomeIcon icon={faTrash} className={styles.icon} />
            </div>
        </div>
    );
}

export default Menu;
