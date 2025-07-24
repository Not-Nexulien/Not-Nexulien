/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./notificationsStyles.css";

import { DataStore } from "@api/index";
import { NotificationLog, signals, useLogs } from "@api/Notifications/notificationLog";
import { classNameFactory } from "@api/Styles";
import { Flex } from "@components/Flex";
import { NxCard, NxCardTitle } from "@components/NxCard";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { NotificationSettings } from "@components/settings/tabs/vencord/NotificationSettings";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { Alerts, Button, TabBar, useState } from "@webpack/common";

const cl = classNameFactory("nx-notifications-");

enum NotificationTab {
    LOG,
    SETTINGS
}

function NotificationsTab() {
    const [log, pending] = useLogs();
    const [currentTab, setCurrentTab] = useState(NotificationTab.LOG);

    function renderNotificationLog() {
        return (
            <>
                <Flex className={classes(Margins.top16, Margins.bottom16)}>
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
                                confirmColor: "nx-notification-log-danger-btn",
                                cancelText: "Nevermind"
                            });
                        }}
                    >
                        Clear Notification Log
                    </Button>
                </Flex>

                <NotificationLog log={log} pending={pending} ></NotificationLog>
            </>
        );
    }

    function renderNotificationSettings() {
        return (
            <>
                <NotificationSettings></NotificationSettings>
            </>
        );
    }

    return <SettingsTab title="Not-Nexulien Notifications">
        <NxCard className="nx-card-help">
            <NxCardTitle>This section is still under development!</NxCardTitle>
            <span>Most of the features, and how this section works, aren't final.
                Please give us feedback! :3</span><br></br><br></br>
            <span>&mdash; Love, Jae</span>
        </NxCard>

        <TabBar
            type="top"
            look="brand"
            className={classes("nx-settings-tab-bar", Margins.top16)}
            selectedItem={currentTab}
            onItemSelect={setCurrentTab}
        >
            <TabBar.Item
                className="nx-settings-tab-bar-item"
                id={NotificationTab.LOG}
            >
                Notification Log
            </TabBar.Item>
            <TabBar.Item
                className="nx-settings-tab-bar-item"
                id={NotificationTab.SETTINGS}
            >
                Settings
            </TabBar.Item>
        </TabBar>

        {currentTab === NotificationTab.LOG && renderNotificationLog()}
        {currentTab === NotificationTab.SETTINGS && renderNotificationSettings()}
    </SettingsTab>;
}

export default wrapTab(NotificationsTab, "Not-Nexulien Notifications");
