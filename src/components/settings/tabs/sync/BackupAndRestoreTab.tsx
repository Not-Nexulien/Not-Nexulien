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

import "@components/settings/tabs/styles.css";

import { downloadSettingsBackup, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { NxCard } from "@components/NxComponents";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { Button,Text } from "@webpack/common";

export function BackupAndRestoreTab() {
    return (
        <SettingsTab>
            <Flex flexDirection="column" gap="0.5em">
                <NxCard variant="warning">
                    <Heading tag="h4">Warning</Heading>
                    <Paragraph>Importing a settings file will overwrite your current settings.</Paragraph>
                </NxCard>

                <Text variant="text-md/normal" className={Margins.bottom8}>
                    You can import and export your Nexulien settings as a JSON file.
                    This allows you to easily transfer your settings to another device,
                    or recover your settings after reinstalling Nexulien or Discord.
                </Text>

                <Heading tag="h4">Settings Export contains:</Heading>
                <Text variant="text-md/normal" className={Margins.bottom8}>
                    <ul>
                        <li>&mdash; Custom QuickCSS</li>
                        <li>&mdash; Theme Links</li>
                        <li>&mdash; Plugin Settings</li>
                    </ul>
                </Text>

                <Flex>
                    <Button onClick={() => uploadSettingsBackup()}>
                        Import Settings
                    </Button>
                    <Button onClick={downloadSettingsBackup}>
                        Export Settings
                    </Button>
                </Flex>
            </Flex>
        </SettingsTab >
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
