<br>
<p align="center">
  <img src="https://i.imgur.com/3lzaO71.png" alt="its GabrielTenma" width="500" height="400">
</p>
<br>


## Gab Lightdm-weebkit
- LightDM-<b>weebkit</b> Theme with modern style :D
- More colorfull & animated background!
- animated Button too!!
- Support MultiAccount
- but requires more processor resources :( 10% avg.

<br>
<br>

## What is LightDM Webkit ?
The lightdm-webkit-greeter allows you to choose a background image directly on the login screen. It also offers an option to display a random image each time it starts if you use the lightdm-gab-gradient theme. 
By default, images are sourced from `/usr/share/backgrounds` . You can change the background images directory by editing lightdm-webkit-greeter.conf

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
