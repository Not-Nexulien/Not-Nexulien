/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ErrorCard } from "@components/ErrorCard";
import { Flex } from "@components/Flex";
import { Link } from "@components/Link";
import { NxCard, NxTitle } from "@components/NxComponents";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { relaunch } from "@utils/native";
import { changes, checkForUpdates, update, updateError } from "@utils/updater";
import { Alerts, Button, Forms, React, Toasts, useState } from "@webpack/common";

import gitHash from "~git-hash";

import { runWithDispatch } from "./runWithDispatch";

export interface CommonProps {
    repo: string;
    repoPending: boolean;
    err: string;
}

export function HashLink({ repo, hash, disabled = false }: { repo: string, hash: string, disabled?: boolean; }) {
    return (
        <Link href={`${repo}/commit/${hash}`} disabled={disabled}>
            {hash}
        </Link>
    );
}

export function Changes({ updates, repo, repoPending }: CommonProps & { updates: typeof changes; }) {
    return (
        <NxCard style={{ padding: "0 0.5em" }} className="vc-updater-changes">
            {updates.map(({ hash, author, message }) => (
                <div
                    key={hash}
                    style={{
                        marginTop: "0.5em",
                        marginBottom: "0.5em"
                    }}
                >
                    <code>
                        <HashLink {...{ repo, hash }} disabled={repoPending} />
                    </code>

                    <span style={{
                        marginLeft: "0.5em",
                        color: "var(--text-default)"
                    }}>
                        {message} - {author}
                    </span>
                </div>
            ))}
        </NxCard>
    );
}

export function Newer(props: CommonProps) {
    return (
        <>
            <NxCard className={classes("nx-card-help", Margins.bottom16)}>
                <Forms.FormText className={Margins.bottom8}>
                    Your local copy has more recent commits. Please stash or reset them.
                </Forms.FormText>
                <Changes {...props} updates={changes} />
            </NxCard>
        </>
    );
}

export function Updatable(props: CommonProps) {
    const [updates, setUpdates] = useState(changes);
    const [isChecking, setIsChecking] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const isOutdated = (updates?.length ?? 0) > 0;

    return (
        <>
            <NxCard variant={isOutdated ? "warning" : (!updates && updateError ? "danger" : "positive")} className={Margins.bottom16}>
                {!updates && updateError ? (
                    <>
                        <Forms.FormText>Failed to check for updates. Check the console for more info</Forms.FormText>
                        <ErrorCard style={{ padding: "1em" }}>
                            <p>{updateError.stderr || updateError.stdout || "An unknown error occurred"}</p>
                        </ErrorCard>
                    </>
                ) : (
                    <Forms.FormText className={Margins.bottom8}>
                        {isOutdated ? (updates.length === 1 ? "There's one update" : `There are ${updates.length} updates`) : "Up to date!"}
                    </Forms.FormText>
                )}

                <Flex className={isOutdated && classes(Margins.bottom8, Margins.top8) || Margins.top8}>
                    {isOutdated && <Button
                        size={Button.Sizes.SMALL}
                        disabled={isUpdating || isChecking}
                        onClick={runWithDispatch(setIsUpdating, async () => {
                            if (await update()) {
                                setUpdates([]);
                                await new Promise<void>(r => {
                                    Alerts.show({
                                        title: "Update Success!",
                                        body: "Successfully updated. Restart now to apply the changes?",
                                        confirmText: "Restart",
                                        cancelText: "Not now!",
                                        onConfirm() {
                                            relaunch();
                                            r();
                                        },
                                        onCancel: r
                                    });
                                });
                            }
                        })}
                    >
                        Update Now
                    </Button>}
                    <Button
                        size={Button.Sizes.SMALL}
                        disabled={isUpdating || isChecking}
                        onClick={runWithDispatch(setIsChecking, async () => {
                            const outdated = await checkForUpdates();
                            if (outdated) {
                                setUpdates(changes);
                            } else {
                                setUpdates([]);
                                Toasts.show({
                                    message: "No updates found!",
                                    id: Toasts.genId(),
                                    type: Toasts.Type.MESSAGE,
                                    options: {
                                        position: Toasts.Position.BOTTOM
                                    }
                                });
                            }
                        })}
                    >
                        Check for Updates
                    </Button>
                </Flex>

                {isOutdated && <Changes updates={updates} {...props} />}
            </NxCard>
        </>
    );
}

export function Repository({ repo, repoPending, err }: CommonProps) {
    return (
        <>
            <NxCard>
                <NxTitle>Repository</NxTitle>

                <Forms.FormText className="vc-text-selectable">
                    {repoPending
                        ? repo
                        : err
                            ? "Failed to retrieve - check Console"
                            : (
                                <Link href={repo}>
                                    {repo.split("/").slice(-2).join("/")}
                                </Link>
                            )
                    }
                    {" "}(<code className="nx-code"><HashLink hash={gitHash} repo={repo} disabled={repoPending} /></code>)
                </Forms.FormText>
            </NxCard>
        </>
    );
}
