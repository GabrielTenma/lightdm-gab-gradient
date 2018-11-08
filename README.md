<br>
<p align="center">
  <img src="https://i.imgur.com/3lzaO71.png" alt="its GabrielTenma" width="500" height="400">
</p>
<br>

## Gab LightDM
- LightDM-webkit Theme with modern style :D
- More colorfull & animated background!
- animated Button too!!
- Support MultiAccount
- but requires more processor resources :( 10% avg.
<br>
<br>

## What is LightDM ?
LightDM is a cross-desktop display manager. Its key features are:
   - Cross-desktop - supports different desktop technologies.
   - Supports different display technologies (X, Mir, Wayland ...).
   - Lightweight - low memory usage and high performance.
   - Supports guest sessions.
   - Supports remote login (incoming - XDMCP, VNC, outgoing - XDMCP, pluggable).
   - Comprehensive test suite.
   - Low code complexity.
<br>

## Installation
Instructions will differ for every platform, but I can tell you how to install it on `Xubuntu`

1. Install and enable `lightdm` and `lightdm-webkit-greeter`
2. In the terminal, navigate to `/usr/share/lightdm-webkit/themes/`
3. Clone this repository here, it should create a folder called `lightdm-gab-gradient`
4. Enable the theme in your `/etc/lightdm/lightdm-webkit-greeter.conf`
5. Replace lightdm-gtk to lightdm-webkit in your `/usr/share/lightdm/lightdm.conf.d/60-lightdm-gtk-greeter.conf`
6. change line code `greeter-session=lightdm-gtk-greeter` to `greeter-session=lightdm-webkit-greeter`
    
<br>

## Font required
you must install this `fonts`

- Segoe UI : https://github.com/meloncholy/mt-stats-viewer/raw/master/public/fonts/segoe-ui/segoeui.ttf
- iosevka  : https://github.com/be5invis/Iosevka/releases/download/v2.0.1/01-iosevka-2.0.1.zip

or you can customize in `CSS`

how to install font? google.com

<br>

## Screenshot 
![](https://raw.githubusercontent.com/GabrielTenma/LightDM-Gab-Gradient/master/.skrinsutan/GabrielDesktop_2018_11_08_13-45-46-1366x768.png)
![](https://raw.githubusercontent.com/GabrielTenma/LightDM-Gab-Gradient/master/.skrinsutan/GabrielDesktop_2018_11_08_13-46-06-1366x768.png)
