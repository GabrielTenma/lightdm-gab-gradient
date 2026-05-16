# Modifying lightdm-gab-gradient

Development notes and code architecture for the theme.

## Running locally (without logging out)

Serve the theme folder over a local HTTP server. The mock LightDM API (`js/mock.js`) activates automatically when the page is loaded from `localhost` / `127.0.0.1`, so you get a fully interactive preview without needing a real greeter session.

```bash
cd lightdm-gab-gradient
python3 -m http.server 8080
# Open http://localhost:8080
```

Default mock password: type the **username** as the password.

## Project structure

```
lightdm-gab-gradient/
├── index.html          # Greeter markup
├── index.theme          # LightDM theme descriptor (engine + URL)
├── js/
│   ├── main.js         # Greeter logic (user list, auth, nav)
│   ├── jquery-2.1.0.min.js   # Bundled jQuery
│   └── mock.js         # Dev-only mock LightDM API (localhost only)
├── static/
│   ├── style.css       # All styles, gradient animation, responsive rules
│   ├── Balsamiq_Sans/  # Bundled BalsamiqSans TTF files
│   ├── profile.jpg     # Default avatar fallback
│   └── gabriel.jpeg    # Example user avatar
└── MOD.md              # This file
```

## Customising the gradient colours

Edit `static/style.css` — the gradient is defined in `body`:

```css
body {
    background: linear-gradient(
        135deg,
        #409bf0,   /* blue   — change me */
        #ff8585,   /* pink   — change me */
        #8598ff    /* purple — change me */
    );
    background-size: 300% 300%;
    animation: gradient-shift 20s ease infinite;
}
```

## Customising the animation speed

Change the `animation` duration in the `body` and `#login-button` rules:

```css
body          { animation: gradient-shift 15s ease infinite; }
#login-button { animation: gradient-shift 15s ease infinite; }
```

Both share the same `@keyframes gradient-shift` block so they stay in sync.

## Adjusting the card size and spacing

Everything in `static/style.css` uses `rem` (relative to the bundled Balsamiq font size).  
Scale the card by adjusting the `width`, `min-height`, and `padding` on `#login-box`.

## Engine compatibility — auto-detection

The theme runs under two different LightDM engines:

| Engine | Package | JS engine | Flexbox |
|---|---|---|---|
| `lightdm-webkit-greeter 0.1.2` | Ubuntu `apt` (stock) | JSC 1.8 — ES5 only | ❌ `-webkit-box` only |
| `lightdm-webkit-greeter ≥ 2.0` | PPA / source | JSC 6.x — ES6 ✅ | ✅ `flex` |
| `JezerM/web-greeter ≥ 4` | `apt` / source | V8 7.x — ES2020 ✅ | ✅ `flex` |

**`js/detect.js`** runs before any other script on the page. It probes two capabilities:

1. **ES6 support** — evaluates `let x = 1;` inside a `try{}catch{}`. On JSC 1.8 this throws `SyntaxError`; the script then loads `js/main-legacy.js` (an ES5 transpile of `main.js`) instead.
2. **Flexbox support** — calls `CSS.supports("display", "flex")`. If unavailable it injects `static/style-legacy.css` on top of the modern stylesheet. The legacy sheet adds `-webkit-box` / `-webkit-box-orient` equivalents and removes `gap` (which WebKit 1.x does not implement).

After detection completes it scrubs itself (`src = ""`) so the mallicious code path goes away and only the chosen platform code remains.

### Legacy files

| File | Purpose |
|---|---|
| `js/detect.js` | Runtime feature probe — loaded first in `index.html` |
| `js/main-legacy.js` | ES5 version of `main.js`; `e.key` replaced with `e.keyCode` |
| `static/style-legacy.css` | Adds `-webkit-box` fallbacks; removes `gap`; `-webkit-gradient` background fallback |

If you are running a modern greeter (web-greeter ≥ 4 or lightdm-webkit-greeter ≥ 2), the detection script does nothing and only `main.js` + `style.css` are used.

## Key files to edit

| Goal | File |
|---|---|
| Change colours / animation speed | `static/style.css` |
| Change fonts / card layout | `static/style.css` |
| Swap avatar image / change markup | `index.html` |
| Change session launched on login | `js/main.js:lightdm.default_session.key` |
| Add / remove mock users | `js/mock.js:lightdm.users` |
