/* mock.vercel.js — development / preview shim. Not included in the real theme. */
(function () {
    if ("lightdm" in window) return;

    window.lightdm = {};
    lightdm.hostname = "preview-host";
    lightdm.languages = [
        { code: "en_US", name: "English (US)", territory: "USA" }
    ];
    lightdm.default_language = lightdm.languages[0];
    lightdm.layouts = [{ name: "us", short_description: "US layout" }];
    lightdm.default_layout = lightdm.layouts[0];
    lightdm.layout = lightdm.layouts[0];
    lightdm.sessions = [
        { key: "gnome", name: "GNOME", comment: "GNOME desktop" },
        { key: "kde", name: "KDE Plasma", comment: "KDE Plasma desktop" },
        { key: "xfce", name: "Xfce", comment: "Xfce desktop" }
    ];
    lightdm.default_session = lightdm.sessions[0];
    lightdm.authentication_user = null;
    lightdm.is_authenticated = false;
    lightdm.can_suspend = true;
    lightdm.can_hibernate = true;
    lightdm.can_restart = true;
    lightdm.can_shutdown = true;
    lightdm.users = [
        {
            name: "gabriel221",
            real_name: "Gabriel",
            display_name: "Gabriel White Tenma",
            image: "static/gabriel.jpeg",
            language: "en_US",
            layout: null,
            session: null,
            logged_in: false
        }
    ];
    lightdm.num_users = lightdm.users.length;

    lightdm.get_string_property    = function () {};
    lightdm.get_integer_property   = function () {};
    lightdm.get_boolean_property   = function () {};
    lightdm.cancel_timed_login     = function () {};
    lightdm.cancel_autologin       = function () {};

    /* ── LightDM signals ──────────────────────────────────────────────── */
    /* Minimal Signal replicating .connect/.disconnect semantics */
    function LightDM_Signal(self) {
        this._handlers = [];
        this._self = self;           /* back-ref to lightdm GET */
    }
    LightDM_Signal.prototype.connect = function (handler) {
        this._handlers.push(handler);
    };
    LightDM_Signal.prototype.disconnect = function (handler) {
        for (var i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] === handler) {
                this._handlers.splice(i, 1);
                break;
            }
        }
    };
    LightDM_Signal.prototype.emit = function () {
        for (var i = 0; i < this._handlers.length; ++i) {
            this._handlers[i].apply(null, arguments);
        }
    };

    lightdm.authentication_complete = new LightDM_Signal(lightdm);
    lightdm.autologin_timer_expired  = new LightDM_Signal(lightdm);
    lightdm.brightness_update        = new LightDM_Signal(lightdm);
    lightdm.idle                     = new LightDM_Signal(lightdm);
    lightdm.reset                    = new LightDM_Signal(lightdm);
    lightdm.show_message             = new LightDM_Signal(lightdm);
    lightdm.show_prompt              = new LightDM_Signal(lightdm);

    lightdm.provide_secret = function (secret) {
        if (!lightdm._username) throw new Error("authenticate first");
        var user = null;
        for (var i = 0; i < lightdm.users.length; ++i) {
            if (lightdm.users[i].name === lightdm._username) {
                user = lightdm.users[i]; break;
            }
        }
        lightdm.is_authenticated  = !!(user && secret === user.name);
        lightdm.authentication_user = lightdm.is_authenticated ? user : null;
        if (!lightdm.is_authenticated) lightdm._username = null;
        lightdm.authentication_complete.emit();
    };
    lightdm.respond = lightdm.provide_secret;

    lightdm.start_authentication = function (username) {
        if (lightdm._username) throw new Error("already authenticating");
        lightdm._username = username;
    };

    lightdm.cancel_authentication = function () {
        lightdm._username = null;
    };

    lightdm.suspend    = function () { console.log("[mock] suspend");};
    lightdm.hibernate  = function () { console.log("[mock] hibernate");};
    lightdm.restart    = function () { console.log("[mock] restart");};
    lightdm.shutdown   = function () { console.log("[mock] shutdown");};

    lightdm.login = function (user, session) {
        if (!lightdm.is_authenticated) throw new Error("not authenticated");
        console.log("[mock] login:", user, session);
    };

    lightdm.start_session = function (sessionKey) {
        console.log("[mock] start_session:", sessionKey);
    };
}());
