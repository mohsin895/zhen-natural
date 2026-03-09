"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";

const Tools = () => {
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedColor, setSelectedColor] = useState("primary");
    const [isRTL, setIsRTL] = useState(false);
    const [isBox, setIsBox] = useState(false);

    // dark mode
    useEffect(() => {
        const darkStyleTag = document.getElementById("add_dark");

        if (isDarkMode && !darkStyleTag) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/assets/css/dark.css";
            link.id = "add_dark";
            document.head.appendChild(link);
        } else if (!isDarkMode && darkStyleTag) {
            darkStyleTag.remove();
        }
    }, [isDarkMode]);

    // rtl mode
    useEffect(() => {
        const rtlStyleTag = document.getElementById("add_rtl");

        if (isRTL && !rtlStyleTag) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/assets/css/rtl.css";
            link.id = "add_rtl";
            document.head.appendChild(link);
        } else if (!isRTL && rtlStyleTag) {
            rtlStyleTag.remove();
        }
    }, [isRTL]);

    //  box-1
    useEffect(() => {
        const boxStyleTag = document.getElementById("add_box");
        if (isBox && !boxStyleTag) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/assets/css/box-1.css";
            link.id = "add_box";
            document.head.appendChild(link);
        } else if (!isBox && boxStyleTag) {
            boxStyleTag.remove();
        }
    }, [isBox]);

    // color
    useEffect(() => {
        const colorStyleTag = document.getElementById("add_class");
        if (colorStyleTag) {
            colorStyleTag.remove();
        }
        if (selectedColor && selectedColor !== "primary") {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/assets/css/${selectedColor}.css`;
            link.id = "add_class";
            document.head.appendChild(link);
        }
    }, [selectedColor])


    const handleDarkModeToggle = (theme: any) => {
        setIsDarkMode(theme === "dark");
    };

    const handleRTLModeToggle = (direction: any) => {
        setIsRTL(direction === "rtl");
    };

    const handleBoxToggle = (box: any) => {
        setIsBox(box === "box-1")
    }

    const handleColorSelect = (colorClass: any) => {
        setSelectedColor(colorClass)
    }

    const openToolsManu = () => {
        setIsToolsMenuOpen(true)
    }
    const closeToolsManu = () => {
        setIsToolsMenuOpen(false)
    }
    return (
        <>
            <div onClick={closeToolsManu} style={{ display: isToolsMenuOpen ? "block" : "none" }} className="bb-tools-sidebar-overlay"></div>
            <div className={`bb-tools-sidebar ${isToolsMenuOpen ? "open-tools" : ""}`}>
                {/* Facebook */}

               <a href="https://m.me/930039480432451"
                target="_blank"
                rel="noopener noreferrer"
                className="bb-tools-sidebar-toggle in-out"
                style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#1877F2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
                >
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                    alt="Facebook"
                    width={25}
                    height={25}
                    unoptimized
                />
            </a>

            {/* WhatsApp */}

             <a href="https://wa.me/8801844545500"
            target="_blank"
            rel="noopener noreferrer"
            className="bb-tools-sidebar-toggle-fb in-out"
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "35px",
                height: "35px",
                borderRadius: "50%",

                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            >
            <Image
                src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                alt="WhatsApp"
                width={35}
                height={35}
                unoptimized
            />
        </a>
                {/*<a onClick={openToolsManu} style={{ display: isToolsMenuOpen ? "none" : "" }} className="bb-tools-sidebar-toggle-fb in-out">*/}
                {/*    <i className="ri-settings-fill"></i>*/}
                {/*</a>*/}



            </div>


        </>
    )
}

export default Tools
