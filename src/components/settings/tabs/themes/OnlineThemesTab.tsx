/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { NxCard, NxCardTitle } from "@components/NxCard";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { Forms, TextArea, useState } from "@webpack/common";

export function OnlineThemesTab() {
    const settings = useSettings(["themeLinks"]);

    const [themeText, setThemeText] = useState(settings.themeLinks.join("\n"));

    // When the user leaves the online theme textbox, update the settings
    function onBlur() {
        settings.themeLinks = [...new Set(
            themeText
                .trim()
                .split(/\n+/)
                .map(s => s.trim())
                .filter(Boolean)
        )];
    }

    return (
        <>
            <NxCard className={`${classes("nx-card-warning", Margins.bottom16)}`}>
                <span>
                    This section is for advanced users. If you are having difficulties using it, use the
                    Local Themes tab instead.
                </span>
            </NxCard>
            <NxCard className="vc-settings-card">
                <NxCardTitle tag="h5">Paste links to css files here</NxCardTitle>
                <span>One link per line</span><br></br>
                <span>You can prefix lines with @light or @dark to toggle them based on your Discord theme</span><br></br>
                <span>Make sure to use direct links to files (raw or github.io)!</span>
            </NxCard>

            <Forms.FormSection title="Online Themes" tag="h5">
                <TextArea
                    value={themeText}
                    onChange={setThemeText}
                    className={"vc-settings-theme-links"}
                    placeholder="Enter Theme Links..."
                    spellCheck={false}
                    onBlur={onBlur}
                    rows={10}
                />
            </Forms.FormSection>
        </>
    );
}
