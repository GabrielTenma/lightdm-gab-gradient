let children;
let currentIndex = 0;
let selectedUser = null;

var $userList;
var $pass;
var $pic;
var $response;

function show_error(msg) {
    console.error("[lightdm-gab-gradient]", msg);
}

function show_message(msg) {
    if ($response) $response.text(msg);
}

function setup_users_list() {
    $userList.empty();
    $.each(lightdm.users, function (i, user) {
        $userList.append(
            $("<span>")
                .attr("data-user-index", i)
                .text(user.display_name || user.name)
        );
    });
    children = $userList.children().length;
}

function find_and_display_user_picture(idx) {
    var user = lightdm.users[idx];
    var src = user && user.image;

    if (src) {
        $pic.attr("src", src);
    } else {
        $pic.attr("src", "static/profile.jpg");
    }

    $pic.on("load", function () {
        $pic.css("opacity", 1);
    }).on("error", function () {
        $pic.attr("src", "static/profile.jpg");
    }).css("opacity", 0);
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
        var sessionKey = lightdm.default_session
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
    var pw = $pass.val();
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
    var offset = currentIndex * 240;
    $userList.css("transform", "-" + offset + "px");
    select_user_from_list(currentIndex, false);
}

function init() {
    $userList = $("#name");
    $pass     = $("#login-password");
    $pic      = $("#login-picture");
    $response = $("#login-response");

    if (!$userList.length || !$pass.length || !$pic.length) {
        console.error("[lightdm-gab-gradient] DOM elements missing – retrying in 250ms");
        setTimeout(init, 250);
        return;
    }

    lightdm.authentication_complete.connect(authentication_complete);
    setup_users_list();

    if (lightdm.users.length > 0) {
        select_user_from_list(0, false);
    }

    $response.text("\u00a0");

    $userList.css("transform", "-" + 0 + "px");

    $("#last").on("click", navigate_prev);

    $("#next").on("click", navigate_next);

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

    $("#login-form").on("submit", function (e) {
        e.preventDefault();
        provide_secret();
    });
}

$(document).ready(function () {
    if (typeof lightdm !== "undefined" && lightdm.users) {
        init();
    }
});
