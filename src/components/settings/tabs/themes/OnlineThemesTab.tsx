/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { NxCard, NxText, NxTitle } from "@components/NxComponents";
import { Margins } from "@utils/margins";
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
            <NxCard variant="warning" className={Margins.bottom16}>
                <NxText>
                    This section is for advanced users. If you are having difficulties using it, use the
                    Local Themes tab instead.
                </NxText>
            </NxCard>
            <NxCard className="vc-settings-card">
                <NxTitle>Paste links to css files here</NxTitle>
                <NxText>
                    <span>&mdash;&nbsp;One link per line</span><br></br>
                    <span>&mdash;&nbsp;You can prefix lines with <code className="nx-code-new">@light</code> or <code className="nx-code-new">@dark</code> to toggle them based on your Discord theme</span><br></br>
                    <span>&mdash;&nbsp;Make sure to use direct links to files (raw or github.io)!</span>
                </NxText>
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
