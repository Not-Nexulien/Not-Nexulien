/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    moveDots: {
        type: OptionType.BOOLEAN,
        description: "Move the more info button to the top right corner of the profile",
        default: true,
        restartNeeded: true,
    }
});

let scrollable: HTMLElement | null = null;

export default definePlugin({
    name: "OldProfiles",
    description: "Restores Discord's old profiles",
    authors: [Devs.Niko],
    settings,

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


        this.observeProfile(profileBody);
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

            if (scrollable) {
                if (scrollable.style) {
                    scrollable.style.visibility = "visible";
                    scrollable.style.zIndex = "10";
                }
            }

            const tabPanel = profileBody.closest('[class^="inner_"]')?.querySelector<HTMLElement>('[class^="tabBarPanel__"]');
            if (tabPanel) tabPanel.style.display = "none";
        };

        const deselectAboutMe = () => {
            aboutTab.ariaSelected = "false";
            aboutTab.className = "tabBarItem__37bfc item_b3f026";

            if (scrollable) {
                if (scrollable.style) {
                    scrollable.style.visibility = "hidden";
                    scrollable.style.zIndex = "0";
                }
            }

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
        if (settings.store.moveDots) {
            const moreButton = buttons.querySelector<HTMLElement>("div:nth-child(3)");
            if (moreButton) {
                moreButton.className = "morebutton";
                profileBody.parentElement?.appendChild(moreButton);
            }
        }
    },

    wrapScrollableContent(profileBody: HTMLElement) {
        scrollable = profileBody.querySelector<HTMLElement>(".oldProfiles-scrollable");
        if (!scrollable) {
            scrollable = document.createElement("div");
            scrollable.className = "oldProfiles-scrollable scrollerBase_d125d2 thin_d125d2";
            profileBody.appendChild(scrollable);
        }

        const allSections = Array.from(profileBody.querySelectorAll<HTMLElement>("section"));

        let bio = allSections[0] as HTMLElement | undefined;
        if (!bio?.className.includes("markup__")) {
            bio = undefined;
        }
        let joinedDate: HTMLElement;

        if (!bio) {
            joinedDate = allSections[0];
        } else {
            joinedDate = allSections[1];
        }

        const roles = allSections.find(s => s.querySelector('[class^="root_"]'));
        const linkedConnections = allSections.find(s => s.querySelector('[class*="profileAppConnections__"]'));
        const notes = allSections.find(s => s.querySelector('[class^="profileNote__"]'));

        const ordered = [bio, joinedDate, roles, linkedConnections, notes];

        for (const section of ordered) {
            if (!section) continue;

            // Skip if already cloned
            if (section.dataset.oldProfilesCloned) continue;

            // Mark as cloned
            section.dataset.oldProfilesCloned = "true";

            const clone = section.cloneNode(true) as HTMLElement;
            scrollable.appendChild(clone);

            // Hide original
            section.style.display = "none";
        }
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

    observeProfile(profileBody: HTMLElement) {
        if ((profileBody as any)._oldProfilesObserver) return;

        const wrapSections = () => {
            this.wrapScrollableContent(profileBody);
        };

        // Debounce to avoid freezing
        let timeout: number | undefined;
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (node.tagName === "SECTION" || node.querySelector("section")) {
                        if (timeout) clearTimeout(timeout);
                        timeout = window.setTimeout(() => {
                            wrapSections();
                        }, 50); // 50ms debounce
                    }
                }
            }
        });

        observer.observe(profileBody, { childList: true, subtree: true });
        (profileBody as any)._oldProfilesObserver = observer;

        // Initial wrap
        wrapSections();
    },

    stop() {
        // MutationObserver cleans itself up when Discord reloads
    }
});
