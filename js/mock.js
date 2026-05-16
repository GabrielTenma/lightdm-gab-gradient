(function () {
    "use strict";

    /**
     * Only activate in development (localhost / 127.0.0.1 / ::1) so the mock
     * never shadows the real lightdm GObject bindings on an actual greeter host.
     */
    var isDev = /(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/.test(
        window.location.hostname
    );

    if (!isDev || "lightdm" in window) {
        return;
    }

    window.lightdm = {};
    lightdm.hostname = "test-host";
    lightdm.languages = [
        {
            code: "en_US",
            name: "English (US)",
            territory: "USA"
        },
        {
            code: "en_GB",
            name: "English (UK)",
            territory: "UK"
        }
    ];
    lightdm.default_language = lightdm.languages[0];
    lightdm.layouts = [
        {
            name: "us",
            short_description: "English (US) layout"
        }
    ];
    lightdm.default_layout = lightdm.layouts[0];
    lightdm.layout = lightdm.layouts[0];
    lightdm.sessions = [
        {
            key: "gnome",
            name: "GNOME",
            comment: "GNOME desktop"
        },
        {
            key: "kde",
            name: "KDE Plasma",
            comment: "KDE Plasma desktop"
        },
        {
            key: "xfce",
            name: "Xfce",
            comment: "Xfce desktop"
        }
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
        },
        {
            name: "brucew",
            real_name: "Bruce",
            display_name: "Bruce Wayne",
            image: "static/profile.jpg",
            language: "en_US",
            layout: null,
            session: null,
            logged_in: false
        },
        {
            name: "peterp",
            real_name: "Peter",
            display_name: "Peter Parker",
            image: "static/profile.jpg",
            language: "en_US",
            layout: null,
            session: null,
            logged_in: false
        }
    ];

    lightdm.num_users = lightdm.users.length;
    lightdm.timed_login_delay = 0; // set > 0 to simulate timed login
    lightdm.timed_login_user =
        lightdm.timed_login_delay > 0 ? lightdm.users[0] : null;

    // ─── property helpers (no-ops in mock) ───────────────────────────────────
    lightdm.get_string_property = function () {};
    lightdm.get_integer_property = function () {};
    lightdm.get_boolean_property = function () {};

    // ─── LightDM API stubs ────────────────────────────────────────────────────
    lightdm.cancel_timed_login = function () {
        _mock_check_arglen(arguments, 0);
        lightdm._timed_login_cancelled = true;
    };

    lightdm.cancel_autologin = function () {
        _mock_check_arglen(arguments, 0);
    };

    lightdm.provide_secret = function (secret) {
        _mock_check_arglen(arguments, 1);

        if (!lightdm._username) {
            throw new Error("must call start_authentication first");
        }

        var user = _mock_find_user(lightdm._username);

        if (user && secret === lightdm._username) {
            lightdm.is_authenticated = true;
            lightdm.authentication_user = user;
        } else {
            lightdm.is_authenticated = false;
            lightdm.authentication_user = null;
            lightdm._username = null;
        }

        if (typeof authentication_complete === "function") {
            authentication_complete();
        }
    };

    /**
     * Compatibility alias: real LightDM WebKit greeter uses `lightdm.respond()`
     * while the original mock exposed `provide_secret`. Provide both.
     */
    lightdm.respond = lightdm.provide_secret;

    lightdm.start_authentication = function (username) {
        _mock_check_arglen(arguments, 1);

        if (lightdm._username) {
            throw new Error("Already authenticating");
        }

        var user = _mock_find_user(username);
        if (!user) {
            show_error(username + " is an invalid user");
        }

        lightdm._username = username;
    };

    lightdm.cancel_authentication = function () {
        _mock_check_arglen(arguments, 0);

        if (!lightdm._username) {
            throw new Error("not currently authenticating");
        }
        lightdm._username = null;
    };

    lightdm.suspend = function () {
        show_error("System suspend triggered (mock)");
    };

    lightdm.hibernate = function () {
        show_error("System hibernate triggered (mock)");
    };

    lightdm.restart = function () {
        show_error("System restart triggered (mock)");
    };

    lightdm.shutdown = function () {
        show_error("System shutdown triggered (mock)");
    };

    lightdm.login = function (user, session) {
        _mock_check_arglen(arguments, 2);

        if (!lightdm.is_authenticated) {
            throw new Error("The system is not authenticated");
        }
        if (user !== lightdm.authentication_user) {
            throw new Error("this user is not authenticated");
        }

        show_error("Login success — mock mode (mock)");
    };

    // ─── Optional session start session mock ─────────────────────────────────
    lightdm.start_session = function (sessionKey) {
        _mock_check_arglen(arguments, 1);

        var session = lightdm.sessions.filter(function (s) {
            return s.key === sessionKey;
        })[0];

        if (!session) {
            throw new Error("Session '" + sessionKey + "' not found");
        }

        show_error(
            "Would start session: " + session.name + " (mock)"
        );
    };

    // ─── Helper functions ─────────────────────────────────────────────────────
    function _mock_check_arglen(args, length) {
        if (args.length !== length) {
            throw new Error(
                "incorrect number of arguments (expected " +
                    length +
                    ", got " +
                    args.length +
                    ")"
            );
        }
    }

    function _mock_find_user(username) {
        for (var i = 0; i < lightdm.users.length; ++i) {
            if (lightdm.users[i].name === username) {
                return lightdm.users[i];
            }
        }
        return null;
    }

}());
