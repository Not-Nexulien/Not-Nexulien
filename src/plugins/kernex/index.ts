/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    serverStyling: {
        type: OptionType.BOOLEAN,
        description: "Enable server styles.",
        default: true
    },
    serverBlockList: {
        type: OptionType.STRING,
        description: "List of server IDs to block. (server styling)",
        default: ""
    }
});

export default definePlugin({
    name: "Kernex",
    description: "Extra core functions for Nexulien",
    nexulien: true,
    authors: [Devs.Zoid, Devs.TechTac],
    required: true,

    settings,

    flux: {
        async CHANNEL_SELECT({ channelId, guildId }) {
            if (settings.store.serverBlockList.includes(guildId) || !settings.store.serverStyling) return;
            const oldClasses = Array.from(document.body.classList);
            oldClasses.filter(c => c.startsWith("guild-") || c.startsWith("channel-")).forEach(c => document.body.classList.remove(c));
            if (channelId) {
                document.body.classList.add(`guild-${guildId}`, `channel-${channelId}`);
            }
            // if (guildId !== prev_server) {
            //     document.querySelector(".nexulien-server-style")?.remove();
            //     const description = GuildStore.getGuild(guildId)?.description;
            //     const urls = description?.match(/\bhttps?:\/\/\S+\b/g);
            //     if (urls) {
            //         for (const url of urls) {
            //             fetch(url, { method: "HEAD" })
            //                 .then(response => response.url)
            //                 .then(resolvedUrl => {
            //                     if (resolvedUrl.endsWith(".css")) {
            //                         const link = document.createElement("link");
            //                         link.rel = "stylesheet";
            //                         link.className = "nexulien-server-style";
            //                         link.href = resolvedUrl;
            //                         document.head.appendChild(link);
            //                     }
            //                 })
            //                 .catch(console.error);
            //         }
            //     }
            //     prev_server = guildId;
            // }
        }
    }
});

