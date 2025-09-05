/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    serverBlockList: {
        type: OptionType.STRING,
        description: "List of server IDs to block. (separate with commas)",
        default: ""
    }
});

export default definePlugin({
    name: "ServerStyling",
    description: "Allows servers to apply their own CSS to Discord.",
    nexulien: true,
    authors: [Devs.Zoid],

    settings,

    flux: {
        async CHANNEL_SELECT({ channelId, guildId }) {
            const oldClasses = Array.from(document.body.classList);
            oldClasses.filter(c => c.startsWith("guild-") || c.startsWith("channel-")).forEach(c => document.body.classList.remove(c));
            if (channelId) {
                document.body.classList.add(`guild-${guildId}`, `channel-${channelId}`);
            }

            if (settings.store.serverBlockList.includes(guildId)) return;
            const res = await fetch(`https://api.zoid.one/nexulien/servercss/${guildId}`);
            if (!res.ok) {
                const styleEl = document.getElementById("server-styling");
                if (styleEl) {
                    styleEl.remove();
                }
                return;
            }
            const css = await res.text();
            let styleEl = document.getElementById("server-styling");
            if (!styleEl) {
                styleEl = document.createElement("style");
                styleEl.id = "server-styling";
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = css;
        }
    }
});

