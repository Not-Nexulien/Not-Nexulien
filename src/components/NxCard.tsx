/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

/*
 * Before you go complaining that this component is unecessary,
 * This code was made *before* Vencord updated their UI, and it's
 * been used in so many places that deprecating it is not worth
 * the hastle - also cry about it.
*/

import "@components/NxCard.css";

export function NxCard({ children, className = "", ...props }) {
    return (
        <div className={`${"nx-card"} ${className}`} {...props}>
            {children}
        </div>
    );
}
