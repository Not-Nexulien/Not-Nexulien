/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./notificationsStyles.css";

import { DataStore } from "@api/index";
import { NotificationLog, useLogs } from "@api/Notifications/notificationLog";
import { classNameFactory } from "@api/Styles";
import { Flex } from "@components/Flex";
import { NxCard } from "@components/NxCard";
import { Margins } from "@utils/margins";
import { Alerts, Button, Forms, Text } from "@webpack/common";
import { DispatchWithoutAction } from "react";

import { NotificationSettings } from "./NotificationSettings";
import { SettingsTab, wrapTab } from "./shared";

const cl = classNameFactory("nx-notifications-");

function NxNotifications() {
    const [log, pending] = useLogs();
    const signals = new Set<DispatchWithoutAction>();

    return <SettingsTab title="Not-Nexulien Notifications">
        <NxCard className="nx-card-warning">
            <Text className="nx-card-title" variant="heading-md/bold">This section is still under development!</Text>
            <span>Most of the features, and how this section works, isn't final.
                Give us some time to cook.
                We've moved this here, so you can test it for now!
                Please give us feedback! :3</span><br></br><br></br>
            <span>&mdash; Love, Jae</span>
        </NxCard>

        <NxCard className={Margins.top16 + " " + Margins.bottom16}>
            <NotificationLog log={log} pending={pending} ></NotificationLog>
        </NxCard>

        <Flex>
            <Button
                disabled={log.length === 0}
                color={Button.Colors.RED}
                onClick={() => {
                    Alerts.show({
                        title: "Are you sure?",
                        body: `This will permanently remove ${log.length} notification${log.length === 1 ? "" : "s"}. This action cannot be undone.`,
                        async onConfirm() {
                            await DataStore.set("notification-log", []);
                            signals.forEach(x => x());
                        },
                        confirmText: "Do it!",
                        confirmColor: "vc-notification-log-danger-btn",
                        cancelText: "Nevermind"
                    });
                }}
            >
                Clear Notification Log
            </Button>
        </Flex>

        <Forms.FormDivider className={Margins.top16}></Forms.FormDivider>

        <NotificationSettings></NotificationSettings>
    </SettingsTab>;
}

export default wrapTab(NxNotifications, "Not-Nexulien Notifications");
