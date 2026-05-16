var children;
var currentIndex = 0;
var selectedUser = null;

var $userList = $("#name");
var $pass = $("#login-password");
var $pic = $("#login-picture");
var $response = $("#login-response");

function show_error(msg) {
    console.error("[lightdm-gab-gradient]", msg);
}

function show_message(msg) {
    $response.text(msg);
}

function setup_users_list() {
    $userList.empty();
    $.each(lightdm.users, function (i, user) {
        var $span = $("<span>")
            .attr("data-user-index", i)
            .text(user.display_name || user.name);
        $userList.append($span);
    });
    children = $userList.children().length;
}

function find_and_display_user_picture(idx) {
    var user = lightdm.users[idx];
    var src = user && user.image;

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
        var sessionKey = null;
        if (lightdm.default_session) {
            sessionKey = lightdm.default_session.key;
        }
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
    var value = "-" + offset + "px";
    $userList.css({
        "-webkit-transform": value,
        "transform":       value
    });
    select_user_from_list(currentIndex, false);
}

function init() {
    lightdm.authentication_complete.connect(authentication_complete);
    setup_users_list();

    if (lightdm.users.length > 0) {
        select_user_from_list(0, false);
    }

    $response.text("\u00a0");

    $("#last").on("click", function () {
        navigate_prev();
    });

    $("#next").on("click", function () {
        navigate_next();
    });

    $(document).on("keydown", function (e) {
        /* keyCode → named key (ES5 / JSC 1.8 compat) */
        var key = e.keyCode || e.which || 0;
        if (key === 37) {
            navigate_prev();
        } else if (key === 39) {
            navigate_next();
        } else if (key === 13 || key === 10) {
            if (document.activeElement === $pass[0]) {
                provide_secret();
            }
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
