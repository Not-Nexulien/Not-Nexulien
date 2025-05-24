/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

export default definePlugin({
  name: "Cobblestone Padding",
  description: "Add padding to Cobblestone's messages via CSS.",
  authors: [Devs.Niko],

  settings: definePluginSettings({
    padding: {
      type: OptionType.NUMBER,
      description: "Amount of padding to add in px",
      default: 15,
    },
  }),

  start() {
    // Create a single style tag and append once
    const style = document.createElement("style");
    const { padding } = this.settings.store;

    document.head.appendChild(style);

    const applyPadding = () => {
        style.innerHTML = `
            div[class^="contents_"]:has(span[data-text^="Cobblestone"]) {
                padding-top: ${padding}px !important;
                padding-bottom: ${padding}px !important;
            }
        `;
    };

    applyPadding();

    this.onSettingsChange = () => {
        applyPadding();
    };
  },
});
