/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import { Link } from "@components/Link";
import { NxCard, NxCardTitle } from "@components/NxCard";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { getStylusWebStoreUrl } from "@utils/web";
import { React, TabBar, useState } from "@webpack/common";

import { CspErrorCard } from "./CspErrorCard";
import { LocalThemesTab } from "./LocalThemesTab";
import { OnlineThemesTab } from "./OnlineThemesTab";

const enum ThemeTab {
    LOCAL,
    ONLINE
}

function ThemesTab() {
    const [currentTab, setCurrentTab] = useState(ThemeTab.LOCAL);

    return (
        <SettingsTab title="Themes">
            <TabBar
                type="top"
                look="brand"
                className="nx-settings-tab-bar"
                selectedItem={currentTab}
                onItemSelect={setCurrentTab}
            >
                <TabBar.Item
                    className="nx-settings-tab-bar-item"
                    id={ThemeTab.LOCAL}
                >
                    Local Themes
                </TabBar.Item>
                <TabBar.Item
                    className="nx-settings-tab-bar-item"
                    id={ThemeTab.ONLINE}
                >
                    Online Themes
                </TabBar.Item>
            </TabBar>

            <CspErrorCard />

            {currentTab === ThemeTab.LOCAL && <LocalThemesTab />}
            {currentTab === ThemeTab.ONLINE && <OnlineThemesTab />}
        </SettingsTab>
    );
}

function UserscriptThemesTab() {
    return (
        <SettingsTab title="Themes">
            <NxCard className="vc-settings-card">
                <NxCardTitle tag="h5">Themes are not supported on the Userscript!</NxCardTitle>

                <span>
                    You can instead install themes with the <Link href={getStylusWebStoreUrl()}>Stylus extension</Link>!
                </span>
            </NxCard>
        </SettingsTab>
    );
}

export default IS_USERSCRIPT
    ? wrapTab(UserscriptThemesTab, "Themes")
    : wrapTab(ThemesTab, "Themes");
