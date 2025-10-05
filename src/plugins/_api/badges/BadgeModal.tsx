/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./badgeModal.css";

import { classNameFactory } from "@api/Styles";
import { Flex } from "@components/Flex";
import { Heart } from "@components/Heart";
import { Link } from "@components/Link";
import { NxCard, NxText } from "@components/NxComponents";
import DonateButton from "@components/settings/DonateButton";
import { classes } from "@utils/misc";
import { ModalContent, ModalFooter, ModalHeader, ModalProps, ModalRoot } from "@utils/modal";
import { Forms } from "@webpack/common";

import { NxSpark } from "./NxSpark";

const cl = classNameFactory("nx-badge-modal-");

export function BadgeModal({ badge, props, nxBadge }: { badge: Record<"tooltip" | "badge", string>, props: ModalProps, nxBadge: boolean; }) {
    return (
        <ModalRoot {...props} className={classes(cl("root"), !nxBadge ? cl("root-vc") : "")}>
            <ModalHeader>
                <Flex style={{ width: "100%", justifyContent: "center" }}>
                    <Forms.FormTitle
                        tag="h2"
                        style={{
                            width: "100%",
                            textAlign: "center",
                            margin: 0
                        }}
                    >
                        {!nxBadge ? <>
                            <Heart />
                            Vencord Donor
                        </> : "Special Badge"}
                    </Forms.FormTitle>
                </Flex>
            </ModalHeader>
            <ModalContent>
                <NxCard variant="grand" className={cl("header")}>
                    <span className={classes(cl("badge"), !nxBadge ? cl("vc-badge") : "")}>
                        <img src={badge.badge} draggable="false"></img>
                    </span>
                    <span className={cl("badge-divider")}></span>
                    <div>
                        <Forms.FormTitle
                            tag="h1"
                            style={{
                                margin: 0
                            }}
                        >
                            {badge.tooltip} {nxBadge ? <NxSpark></NxSpark> : ""}
                        </Forms.FormTitle>
                        <Forms.FormText>
                            {!nxBadge ?
                                "This Badge was given to this user as a special perk for Vencord Donors." :
                                "This Badge was granted to this user by the owner of Nexulien."
                            }
                        </Forms.FormText>
                    </div>
                </NxCard>
                <NxCard size="small" className={cl("description")}>
                    <NxText size="small">
                        {!nxBadge ?
                            "Please consider supporting the development of Vencord by becoming a donor! It would mean a lot to them." :
                            "Currently the only way to get a badge is by asking @zoid.one, or getting a PR accepted in the assets repo."
                        }
                    </NxText>
                </NxCard>
            </ModalContent>
            <ModalFooter>
                <Flex style={{ width: "100%", justifyContent: "center" }}>
                    {!nxBadge ?
                        <DonateButton /> :
                        <Forms.FormText>
                            <Link href="https://github.com/Nexulien/assets">Visit the assets repo</Link>
                        </Forms.FormText>
                    }
                </Flex>
            </ModalFooter>
        </ModalRoot>
    );
}
