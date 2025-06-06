export interface JSONSchema {
    playerId:           number;
    steamAccountName:   string;
    steamAccountAvatar: string;
    created:            Date;
    steamId:            string;
    clientBuildVersion: string;
    lastAccess:         Date;
    webapp:             Webapp;
    country:            string;
    kovaaksPlusActive:  boolean;
    badges:             any[];
    followCounts:       FollowCounts;
    kovaaksPlus:        KovaaksPlus;
    scenariosPlayed:    string;
}

export interface FollowCounts {
    following: number;
    followers: number;
}

export interface KovaaksPlus {
    active:     boolean;
    expiration: Date;
}

export interface Webapp {
    roles:               Roles;
    videos:              any[];
    username:            string;
    socialMedia:         SocialMedia;
    gameSettings:        GameSettings;
    profileImage:        null;
    profileViews:        number;
    hasSubscribed:       boolean;
    gamingPeripherals:   GamingPeripherals;
    username_changed_at: Date;
}

export interface GameSettings {
    dpi:         null;
    fov:         null;
    cm360:       null;
    rawInput:    string;
    sensitivity: null;
}

export interface GamingPeripherals {
    mouse:    string;
    headset:  null;
    monitor:  null;
    keyboard: null;
    mousePad: string;
}

export interface Roles {
    admin: boolean;
    coach: boolean;
    staff: boolean;
}

export interface SocialMedia {
    tiktok:     null;
    twitch:     null;
    discord:    string;
    twitter:    null;
    youtube:    null;
    discord_id: string;
}
