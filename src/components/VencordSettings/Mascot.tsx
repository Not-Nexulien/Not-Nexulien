/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useState } from "@webpack/common";

/*
 * Credits to our Mascot Lyra go to the original Artist, Kuro.
 * All rights reserved unless given permission.
 */

interface SingleDate {
    month: number,
    day: number;
}
interface SpanDate {
    startDate: SingleDate,
    endDate: SingleDate;
}

const API = "https://api.zoid.one/nexulien/assets/";
const TEMP_MASCOT_IMAGE = ""; // removed bc no permission

const LQ_FALLBACK_B64 = ""; // same reason

export function NxMascot({ ...props }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <img
            className={`${"nx-mascot"}`} {...props}
            style={{
                marginLeft: "auto",
                backgroundImage: !loaded ? "url(" + LQ_FALLBACK_B64 + ")" : "none",
                backgroundSize: 128
            }}
            src={TEMP_MASCOT_IMAGE}
            role="presentation"
            alt=""
            draggable="false"
            height={128}
            width={128}
            onLoad={() => setLoaded(true)}
        ></img>
    );
}
