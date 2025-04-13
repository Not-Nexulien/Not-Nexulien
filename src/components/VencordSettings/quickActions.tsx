/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// this code is horrible this code is horrible this code is horrible this code is horrible this code is horrible this code is horrible this code is horrible this code is horrible
// - love, jae
// (seriously though what the fuck how does react work)

import "./quickActions.css";

import { classNameFactory } from "@api/Styles";
import { InfoIcon } from "@components/Icons";
import { classes } from "@utils/misc";
import { findByPropsLazy } from "@webpack";
import { Alerts, Button, Text } from "@webpack/common";
import type { ComponentType, PropsWithChildren, ReactNode } from "react";

import { NxCard } from "./NxCard";

const cl = classNameFactory("nx-settings-quickActions-");
const ButtonClasses = findByPropsLazy("button", "disabled", "enabled");

export interface QuickActionProps {
    Icon: ComponentType<{ className?: string; }>;
    text: ReactNode;
    action?: () => void;
    disabled?: boolean;
}
interface QuickActionContainerProps {
    title: string;
}

export function QuickAction(props: QuickActionProps) {
    const { Icon, action, text, disabled } = props;

    return (
        <Button look={Button.Looks.FILLED} color={Button.Colors.PRIMARY} onClick={action} disabled={disabled}>
            <div className={cl("button")}>
                <Icon className={cl("img")} />
                {text}
            </div>
        </Button>
    );
}

export function QuickActionContainer({ title, children }: PropsWithChildren<QuickActionContainerProps>) {
    return (
        <NxCard className={cl("container")}>
            <Text className={cl("title")} variant="heading-md/bold">
                {title}
                <button
                    role="switch"
                    onClick={() => {
                        Alerts.show({
                            title: "Information",
                            body: (
                                <>
                                    <div className={cl("help")}>
                                        <img height="64px" width="64px" src="https://cdn.discordapp.com/emojis/1348781960453161011.gif" draggable="false"></img>
                                        <p>No one's around to help.</p>
                                    </div>
                                </>
                            ),
                            confirmText: "(≧∀≦)ゞ",
                            onConfirm: () => console.log("sigma or sugma?")
                        });
                    }}
                    className={classes(ButtonClasses.button, cl("info-button"))}
                >
                    <InfoIcon />
                </button>
            </Text>
            <span className={cl("containerButtons")}>{children}</span>
        </NxCard>
    );
}
