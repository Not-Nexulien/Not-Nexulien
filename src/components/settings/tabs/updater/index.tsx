/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import { useSettings } from "@api/Settings";
import { FormSwitch } from "@components/FormSwitch";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { useAwaiter } from "@utils/react";
import { getRepo, isNewer, UpdateLogger } from "@utils/updater";
import { Forms, React } from "@webpack/common";

import { CommonProps, Newer, Repository, Updatable } from "./Components";

function Updater() {
    const settings = useSettings(["autoUpdate", "autoUpdateNotification"]);

    const [repo, err, repoPending] = useAwaiter(getRepo, {
        fallbackValue: "Loading...",
        onError: e => UpdateLogger.error("Failed to retrieve repo", err)
    });

    const commonProps: CommonProps = {
        repo,
        repoPending,
        err
    };

    return (
        <SettingsTab title="Not-Nexulien Updater">
            <Forms.FormTitle tag="h5" className={Margins.bottom16}>Updater Settings</Forms.FormTitle>

            <FormSwitch
                title="Automatically update"
                description="Automatically update Not-Nexulien without confirmation prompt"
                value={settings.autoUpdate}
                onChange={(v: boolean) => settings.autoUpdate = v}
            />
            <FormSwitch
                title="Get notified when an automatic update completes"
                description="Show a notification when Not-Nexulien automatically updates"
                value={settings.autoUpdateNotification}
                onChange={(v: boolean) => settings.autoUpdateNotification = v}
                disabled={!settings.autoUpdate}
            />

            <Forms.FormTitle tag="h5">Updates</Forms.FormTitle>

            {isNewer
                ? <Newer {...commonProps} />
                : <Updatable {...commonProps} />
            }

            <Repository {...commonProps} />
        </SettingsTab>
    );
}

export default IS_UPDATER_DISABLED
    ? null
    : wrapTab(Updater, "Updater");
