import { type AccessControl, createAccessControl } from "better-auth/plugins/access";
import { Server, Shield, User } from "lucide-svelte";

const permissions = {
    asset: ["create", "view", "edit", "delete"],
    category: ["create", "view", "edit", "delete"],
    tag: ["create", "view", "edit", "delete"],
    location: ["create", "view", "edit", "delete"],
    booking: ["create", "view", "edit", "delete", "view-own", "edit-own", "delete-own", "set-status"],
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"]
};

export const ac: AccessControl = createAccessControl(permissions);

export const user = ac.newRole({
    asset: ["view"],
    category: ["view"],
    tag: ["view"],
    location: ["view"],
    booking: ["create", "view-own", "edit-own", "delete-own"],
})

export const manager = ac.newRole({
    asset: ["create", "view", "edit", "delete"],
    category: ["create", "view", "edit", "delete"],
    tag: ["create", "view", "edit", "delete"],
    location: ["create", "view", "edit", "delete"],
    booking: ["create", "view", "edit", "delete", "view-own", "edit-own", "delete-own", "set-status"]
})


export const admin = ac.newRole({
    asset: ["create", "view", "edit", "delete"],
    category: ["create", "view", "edit", "delete"],
    tag: ["create", "view", "edit", "delete"],
    location: ["create", "view", "edit", "delete"],
    booking: ["create", "view", "edit", "delete", "view-own", "edit-own", "delete-own", "set-status"],
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"]
})

export const roles = { user, manager, admin }

export const roleSelector = [
    { id: "user", name: "User", icon: User },
    { id: "manager", name: "Manager", icon: Shield },
    { id: "admin", name: "Admin", icon: Server }
]
