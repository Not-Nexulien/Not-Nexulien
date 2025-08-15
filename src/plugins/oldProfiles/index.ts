/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "OldProfiles",
    description: "Restores Discord's old profiles",
    authors: [Devs.Niko],

    start() {
        const observer = new MutationObserver(mutations => {
            for (const { addedNodes } of mutations) {
                for (const node of addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    // Handle profile UI
                    this.handleProfile(node);

                    // Handle tooltip positioning when it appears
                    this.handleClickTrap(node);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    },

    handleProfile(root: HTMLElement) {
        const tabRow = root.querySelector<HTMLElement>(".top_b3f026");
        const profileBody = root.querySelector<HTMLElement>('[class^="profileBody__"]');
        if (!tabRow || !profileBody || tabRow.querySelector(".about-me-tab")) return;

        this.addAboutMeTab(tabRow, profileBody);
        this.fixPinnedElements(profileBody);
        this.wrapScrollableContent(profileBody);
    },

    addAboutMeTab(tabRow: HTMLElement, profileBody: HTMLElement) {
        const aboutTab = document.createElement("div");
        aboutTab.className = "tabBarItem__37bfc item_b3f026 about-me-tab";
        aboutTab.role = "tab";
        aboutTab.tabIndex = 0;
        aboutTab.ariaSelected = "false";
        aboutTab.textContent = "About Me";

        // Disable tab focus on other tabs
        tabRow.querySelectorAll('[role="tab"]').forEach(tab => tab.setAttribute("tabindex", "-1"));

        // Insert at the start
        tabRow.prepend(aboutTab);

        const selectAboutMe = () => {
            tabRow.querySelectorAll('[role="tab"]').forEach(tab => {
                tab.ariaSelected = "false";
                tab.className = "tabBarItem__37bfc item_b3f026";
                tab.setAttribute("tabindex", "-1");
            });

            aboutTab.ariaSelected = "true";
            aboutTab.className = "tabBarItem__37bfc item_b3f026 selected_b3f026";
            aboutTab.tabIndex = 0;

            profileBody.querySelectorAll("section").forEach(section => {
                section.setAttribute("style", "visibility: visible; position: relative; z-index: 10;");
            });

            const tabPanel = profileBody.closest('[class^="inner_"]')?.querySelector<HTMLElement>('[class^="tabBarPanel__"]');
            if (tabPanel) tabPanel.style.display = "none";
        };

        const deselectAboutMe = () => {
            aboutTab.ariaSelected = "false";
            aboutTab.className = "tabBarItem__37bfc item_b3f026";

            profileBody.querySelectorAll("section").forEach(section => section.style.visibility = "hidden");

            const tabPanel = profileBody.closest('[class^="inner_"]')?.querySelector<HTMLElement>('[class^="tabBarPanel__"]');
            if (tabPanel) tabPanel.style.display = "flex";
        };

        aboutTab.addEventListener("click", selectAboutMe);
        tabRow.querySelectorAll('[role="tab"]').forEach(tab => {
            if (tab !== aboutTab) tab.addEventListener("click", deselectAboutMe);
        });

        // Select About Me by default
        aboutTab.click();
    },

    fixPinnedElements(profileBody: HTMLElement) {
        const buttons = document.querySelector<HTMLElement>('[class^="profileButtons__"]');
        const userContainer = profileBody.firstElementChild as HTMLElement | null;

        if (!buttons || !userContainer) return;

        profileBody.addEventListener("scroll", () => {
            const scrollY = profileBody.scrollTop;
            [buttons, userContainer].forEach(el => {
                el.style.transform = `translateY(${scrollY}px)`;
                el.style.zIndex = "999";
            });
        });

        // Move "More" button outside scroll flow
        const moreButton = buttons.querySelector<HTMLElement>("div:nth-child(3)");
        if (moreButton) {
            moreButton.className = "morebutton";
            profileBody.parentElement?.appendChild(moreButton);
        }
    },

    wrapScrollableContent(profileBody: HTMLElement) {
        const scrollable = document.createElement("div");
        scrollable.className = "scrollable scrollerBase_d125d2 thin_d125d2";

        const sections = Array.from(profileBody.querySelectorAll<HTMLElement>("section")).slice(2, 6);
        sections.forEach(section => scrollable.appendChild(section));

        profileBody.appendChild(scrollable);
    },

    handleClickTrap(node: HTMLElement) {
        const clickTrap = node.matches?.('[class^="clickTrapContainer_"] > div[class*="disabledPointerEvents_"]')
            ? node as HTMLElement
            : node.querySelector?.('[class^="clickTrapContainer_"] > div[class*="disabledPointerEvents_"]') as HTMLElement;

        if (!clickTrap || !clickTrap.innerHTML.includes("More")) return;

        const moreButton = document.querySelector<HTMLElement>(".morebutton");
        if (!moreButton) return;

        const positionClickTrap = () => {
            const btnRect = moreButton.getBoundingClientRect();
            clickTrap.style.position = "absolute";
            clickTrap.style.left = `${btnRect.left + (btnRect.width / 2) - (clickTrap.offsetWidth / 2)}px`;
            clickTrap.style.top = `${btnRect.top - clickTrap.offsetHeight - 16}px`;
            clickTrap.style.bottom = "unset";
        };

        positionClickTrap();
        window.addEventListener("resize", positionClickTrap);

        const profileBody = moreButton.closest<HTMLElement>('[class^="profileBody__"]');
        profileBody?.addEventListener("scroll", positionClickTrap);
    },

    stop() {
        // MutationObserver cleans itself up when Discord reloads
    }
});
