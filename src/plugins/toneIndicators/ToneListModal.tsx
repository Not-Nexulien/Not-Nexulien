/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { NxCard } from "@components/VencordSettings/NxCard";
import { ModalCloseButton, ModalContent, ModalHeader, ModalProps, ModalRoot } from "@utils/modal";
import { Forms } from "@webpack/common";

import { cl, toneIndicators } from "./index";

function ToneItem({ indicators, description, ...props }) {
    return (
        <NxCard className={cl("list-card")} {...props}>
            <span className={cl("list-indicators")}>
                {indicators.map(indicator => (
                    <span key={indicator}>{indicator}</span>
                ))}
            </span>
            <span>{description}</span>
        </NxCard>
    );
}

export function ToneListModal({ rootProps }: { rootProps: ModalProps; }) {
    return (
        <ModalRoot {...rootProps}>
            <ModalHeader className={cl("modal-header")}>
                <Forms.FormTitle tag="h2" className={cl("modal-title")}>
                    Tone List
                </Forms.FormTitle>
                <ModalCloseButton onClick={rootProps.onClose} />
            </ModalHeader>

            <ModalContent className={cl("modal-content")}>
                <div className={cl("list")}>
                    {toneIndicators.map((indicator, index) => (
                        <ToneItem key={index} indicators={indicator.short} description={indicator.long}></ToneItem>
                    ))}
                </div>
            </ModalContent>
        </ModalRoot>
    );
}
