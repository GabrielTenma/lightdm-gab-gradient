(function () {
    "use strict";

    /**
     * Runtime feature detect for the greeter engine.
     *
     * Two things can fail on old WebKitGTK 1.x / lightdm-webkit-greeter 0.1.2:
     *   1. ES6 syntax (let / const)  — JSC 1.8 is ES5-only
     *   2. unprefixed flexbox          — WebKit 1.x only supports -webkit-box
     *
     * If ES6 fails we swap in main-legacy.js (ES5 transpile) and
     * style-legacy.css (vendor-prefix fallbacks + box layout).
     * If flexbox fails we swap in style-legacy.css only.
     *
     * jQuery (loaded next) will handle CSS insertion regardless of engine.
     */
    function detect(onReady) {
        var es6Ok = false;
        var flexOk = false;

        /* ── ES6 pass ────────────────────────────────────────────────────── */
        try {
            /* eslint-disable no-eval */
            /* jshint evil: true */
            eval("'use strict'; let _es6_test = 1;");
            es6Ok = true;
        } catch (e) {
            es6Ok = false;
        }

        /* ── Flexbox pass ────────────────────────────────────────────────── */
        if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
            flexOk = CSS.supports("display", "flex");
        } else {
            /* CSS.supports itself missing → definitely no flexbox */
            flexOk = false;
        }

        onReady(es6Ok, flexOk);
    }

    detect(function (es6Ok, flexOk) {
        var needEs5  = !es6Ok;
        var needFlex = !flexOk;

        /* Swap CSS if flexbox is missing or we need _both_ legacy paths */
        if (needFlex || needEs5) {
            var css = document.createElement("link");
            css.rel  = "stylesheet";
            css.href = "static/style-legacy.css";
            document.head.appendChild(css);
        }

        /* Swap JS if ES6 is not supported */
        if (needEs5) {
            var script = document.createElement("script");
            script.src  = "js/main-legacy.js";
            script.type = "text/javascript";
            document.head.appendChild(script);
        }
    });

}());
