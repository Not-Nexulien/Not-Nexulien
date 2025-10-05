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

import "./fixDiscordBadgePadding.css";

import { _getBadges, BadgePosition, BadgeUserArgs, ProfileBadge } from "@api/Badges";
import ErrorBoundary from "@components/ErrorBoundary";
import { openContributorModal } from "@components/settings/tabs";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import { copyWithToast, shouldShowContributorBadge } from "@utils/misc";
import { closeModal, openModal } from "@utils/modal";
import definePlugin from "@utils/types";
import { User } from "@vencord/discord-types";
import { ContextMenuApi, Menu, Toasts, UserStore } from "@webpack/common";

import { BadgeModal } from "./BadgeModal";


const CONTRIBUTOR_BADGE = "https://raw.githubusercontent.com/Nexulien/assets/main/badges/contributor.png";

const ContributorBadge: ProfileBadge = {
    description: "(Not) Nexulien Contributor",
    image: CONTRIBUTOR_BADGE,
    position: BadgePosition.START,
    shouldShow: ({ userId }) => shouldShowContributorBadge(userId),
    onClick: (_, { userId }) => openContributorModal(UserStore.getUser(userId))
};


let DonorBadges = {} as Record<string, Array<Record<"tooltip" | "badge", string>>>;
let NexulienBadges = {} as Record<string, Array<Record<"tooltip" | "badge", string>>>;
let NotNexulienBadges = {} as Record<string, Array<Record<"tooltip" | "title" | "name" | "badge" | "description" | "description2" | "link" | "linkdesc", string>>>;

async function loadBadges(noCache = false) {
    DonorBadges = {};
    NexulienBadges = {};
    NotNexulienBadges = {};

    const init = {} as RequestInit;
    if (noCache)
        init.cache = "no-cache";

    NexulienBadges = await fetch("https://raw.githubusercontent.com/defautluser0/nexassets/main/badges.json", init)
        .then(r => r.json());

    NotNexulienBadges = await fetch("https://raw.githubusercontent.com/defautluser0/nexassets/main/badgesnew.json", init)
        .then(r => r.json());

    DonorBadges = await fetch("https://badges.vencord.dev/badges.json", init)
        .then(r => r.json());
}

let intervalId: any;

function BadgeContextMenu({ badge }: { badge: ProfileBadge & BadgeUserArgs; }) {
    return (
        <Menu.Menu
            navId="vc-badge-context"
            onClose={ContextMenuApi.closeContextMenu}
            aria-label="Badge Options"
        >
            {badge.description && (
                <Menu.MenuItem
                    id="vc-badge-copy-name"
                    label="Copy Badge Name"
                    action={() => copyWithToast(badge.description!)}
                />
            )}
            {badge.image && (
                <Menu.MenuItem
                    id="vc-badge-copy-link"
                    label="Copy Badge Image Link"
                    action={() => copyWithToast(badge.image!)}
                />
            )}
        </Menu.Menu>
    );
}

export default definePlugin({
    name: "BadgeAPI",
    description: "API to add badges to users",
    authors: [Devs.Megu, Devs.Ven, Devs.TheSun],
    required: true,
    patches: [
        {
            find: ".MODAL]:26",
            replacement: {
                match: /(?=;return 0===(\i)\.length\?)(?<=(\i)\.useMemo.+?)/,
                replace: ";$1=$2.useMemo(()=>[...$self.getBadges(arguments[0].displayProfile),...$1],[$1])"
            }
        },
        {
            find: "#{intl::PROFILE_USER_BADGES}",
            replacement: [
                {
                    match: /(alt:" ","aria-hidden":!0,src:)(.+?)(?=,)(?<=href:(\i)\.link.+?)/,
                    replace: (_, rest, originalSrc, badge) => `...${badge}.props,${rest}${badge}.image??(${originalSrc})`
                },
                {
                    match: /(?<="aria-label":(\i)\.description,.{0,200})children:/,
                    replace: "children:$1.component?$self.renderBadgeComponent({...$1}) :"
                },
                // handle onClick and onContextMenu
                {
                    match: /href:(\i)\.link/,
                    replace: "...$self.getBadgeMouseEventHandlers($1),$&"
                }
            ]
        },
        {
            find: "profileCardUsernameRow,children:",
            replacement: {
                match: /badges:(\i)(?<=displayProfile:(\i).+?)/,
                replace: "badges:[...$self.getBadges($2),...$1]"
            }
        }
    ],

    // for access from the console or other plugins
    get DonorBadges() {
        return DonorBadges;
    },

    toolboxActions: {
        async "Refetch Badges"() {
            await loadBadges(true);
            Toasts.show({
                id: Toasts.genId(),
                message: "Successfully refetched badges!",
                type: Toasts.Type.SUCCESS
            });
        }
    },

    userProfileBadge: ContributorBadge,

    async start() {
        await loadBadges();

        clearInterval(intervalId);
        intervalId = setInterval(loadBadges, 1000 * 60 * 30); // 30 minutes
    },

    async stop() {
        clearInterval(intervalId);
    },

    getBadges(props: { userId: string; user?: User; guildId: string; }) {
        if (!props) return [];

        try {
            props.userId ??= props.user?.id!;

            return _getBadges(props);
        } catch (e) {
            new Logger("BadgeAPI#hasBadges").error(e);
            return [];
        }
    },

    renderBadgeComponent: ErrorBoundary.wrap((badge: ProfileBadge & BadgeUserArgs) => {
        const Component = badge.component!;
        return <Component {...badge} />;
    }, { noop: true }),


    getBadgeMouseEventHandlers(badge: ProfileBadge & BadgeUserArgs) {
        const handlers = {} as Record<string, (e: React.MouseEvent) => void>;

        if (!badge) return handlers; // sanity check

        const { onClick, onContextMenu } = badge;

        if (onClick) handlers.onClick = e => onClick(e, badge);
        if (onContextMenu) handlers.onContextMenu = e => onContextMenu(e, badge);

        return handlers;
    },

    getDonorBadges(userId: string) {
        return DonorBadges[userId]?.map(badge => ({
            image: badge.badge,
            description: badge.tooltip,
            position: BadgePosition.START,
            props: {
                style: {
                    borderRadius: "50%",
                    transform: "scale(0.9)" // The image is a bit too big compared to default badges
                }
            },
            onClick() {
                const modalKey = openModal(props => (
                    <ErrorBoundary noop onError={() => {
                        closeModal(modalKey);
                        VencordNative.native.openExternal("https://github.com/sponsors/Vendicated");
                    }}>
                        {
                            //                       ↓ nxBadge?
                            //                             ↓ !nxBadge?
                            BadgeModal(badge, props, false, false)
                        }
                    </ErrorBoundary>
                ));
            },
        }));
    },

    getNexulienBadges(userId: string) {
        return NexulienBadges[userId]?.map(badge => ({
            image: badge.badge,
            description: badge.tooltip,
            position: BadgePosition.START,
            props: {
                style: {
                    borderRadius: "50%",
                    transform: "scale(0.9)" // The image is a bit too big compared to default badges
                }
            },
            onContextMenu(event, badge) {
                ContextMenuApi.openContextMenu(event, () => <BadgeContextMenu badge={badge} />);
            },
            onClick() {
                const modalKey = openModal(props => (
                    <ErrorBoundary noop onError={() => {
                        closeModal(modalKey);
                        VencordNative.native.openExternal("https://github.com/not-nexulien/Not-Nexulien/blob/main/src/plugins/_api/badges/index.tsx");
                    }}>
                        {
                            //                       ↓ nxBadge?
                            //                             ↓ !nxBadge?
                            BadgeModal(badge, props, true, false)
                        }
                    </ErrorBoundary>
                ));
            },
        } satisfies ProfileBadge));
    },
    getNotNexulienBadges(userId: string) {
        return NotNexulienBadges[userId]?.map(badge => ({
            image: badge.badge,
            description: badge.tooltip,
            position: BadgePosition.START,
            props: {
                style: {
                    borderRadius: "50%",
                    transform: "scale(0.9)" // The image is a bit too big compared to default badges
                }
            },
            onContextMenu(event, badge) {
                ContextMenuApi.openContextMenu(event, () => <BadgeContextMenu badge={badge} />);
            },
            onClick() {
                const modalKey = openModal(props => (
                    <ErrorBoundary noop onError={() => {
                        closeModal(modalKey);
                        VencordNative.native.openExternal("https://github.com/not-nexulien/Not-Nexulien/blob/main/src/plugins/_api/badges/index.tsx");
                    }}>
                        {
                            //                       ↓ nxBadge?
                            //                             ↓ !nxBadge?
                            BadgeModal(badge, props, false, true)
                        }
                    </ErrorBoundary>
                ));
            }
        }));
    }
});
