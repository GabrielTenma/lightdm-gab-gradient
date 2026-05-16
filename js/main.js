let children;
let currentIndex = 0;
let selectedUser = null;

const $userList = $("#name");
const $pass = $("#login-password");
const $pic = $("#login-picture");
const $response = $("#login-response");

function show_error(msg) {
    console.error("[lightdm-gab-gradient]", msg);
}

function show_message(msg) {
    $response.text(msg);
}

function setup_users_list() {
    $userList.empty();
    $.each(lightdm.users, function (i, user) {
        $userList.append(
            $("<span>").attr("data-user-index", i).text(user.display_name || user.name)
        );
    });
    children = $userList.children().length;
}

function find_and_display_user_picture(idx) {
    const user = lightdm.users[idx];
    const src = user && user.image;

    $pic.css("opacity", 0);

    setTimeout(function () {
        if (src) {
            $pic.attr("src", src);
        } else {
            $pic.attr("src", "static/profile.jpg");
        }
        $pic.css("opacity", 1);
    }, 250);
}

function select_user_from_list(idx, err) {
    idx = idx || 0;

    if (!err) {
        find_and_display_user_picture(idx);
    }

    if (lightdm.authentication_user) {
        lightdm.cancel_authentication();
    }

    selectedUser = lightdm.users[idx] ? lightdm.users[idx].username : null;

    if (selectedUser) {
        start_authentication(selectedUser);
    }

    $pass.trigger("focus").val("");
}

function start_authentication(username) {
    lightdm.cancel_autologin();

    selectedUser = username;
    lightdm.authenticate(username);
}

function authentication_complete() {
    if (lightdm.is_authenticated) {
        const sessionKey = lightdm.default_session
            ? lightdm.default_session.key
            : null;
        if (sessionKey) {
            lightdm.start_session(sessionKey);
        }
    } else {
        show_message("Wrong password!");
        $pass.val("").trigger("focus");
    }
}

function provide_secret() {
    const pw = $pass.val();
    if (pw) {
        lightdm.respond(pw);
    }
}

function navigate_prev() {
    if (children <= 1) return;
    currentIndex = (currentIndex - 1 + children) % children;
    update_user_view();
}

function navigate_next() {
    if (children <= 1) return;
    currentIndex = (currentIndex + 1) % children;
    update_user_view();
}

function update_user_view() {
    const offset = currentIndex * 240;
    $userList.css("transform", `translateX(-${offset}px)`);
    select_user_from_list(currentIndex, false);
}

function init() {
    // Make sure mock is only loaded in dev context (see mock.js gate)
    lightdm.authentication_complete.connect(authentication_complete);
    setup_users_list();

    if (lightdm.users.length > 0) {
        select_user_from_list(0, false);
    }

    $response.text("\u00a0");

    // User navigation buttons
    $("#last").on("click", function () {
        navigate_prev();
    });

    $("#next").on("click", function () {
        navigate_next();
    });

    // Keyboard navigation
    $(document).on("keydown", function (e) {
        switch (e.key) {
            case "ArrowLeft":
                navigate_prev();
                break;
            case "ArrowRight":
                navigate_next();
                break;
            case "Enter":
            case "Return":
                if (document.activeElement === $pass[0]) {
                    provide_secret();
                }
                break;
        }
    });

    // Form submission
    $("#login-form").on("submit", function (e) {
        e.preventDefault();
        provide_secret();
    });
}

$(document).ready(function () {
    // Guards: only run when lightdm API is present
    if (typeof lightdm !== "undefined" && lightdm.users) {
        init();
    }
});
