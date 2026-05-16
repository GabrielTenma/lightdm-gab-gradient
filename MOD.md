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

## Key files to edit

| Goal | File |
|---|---|
| Change colours / animation speed | `static/style.css` |
| Change fonts / card layout | `static/style.css` |
| Swap avatar image / change markup | `index.html` |
| Change session launched on login | `js/main.js:lightdm.default_session.key` |
| Add / remove mock users | `js/mock.js:lightdm.users` |
