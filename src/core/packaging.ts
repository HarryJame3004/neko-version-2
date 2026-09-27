/**
 * Arch Linux Packaging and Desktop Integration Specifications
 * Compliant with Arch Linux Packaging Standards, makepkg, and XDG specifications.
 */

export const PKGBUILD_CONTENT = `# Maintainer: Tran Khoi <trankhoi0606@gmail.com>
# Contributor: Ghostly Team
pkgname=ghostly
pkgver=1.2.0
pkgrel=1
pkgdesc="Adaptive Dynamic Island desktop companion for Arch Linux & KDE Plasma"
arch=('x86_64')
url="https://github.com/ghostly-linux/ghostly"
license=('GPL3')
depends=(
    'qt6-base'
    'qt6-declarative'
    'qt6-svg'
    'qt6-wayland'
    'kwayland'
    'plasma-framework'
    'playerctl'
    'lm_sensors'
)
makedepends=(
    'cmake'
    'extra-cmake-modules'
    'git'
    'ninja'
)
optdepends=(
    'spotify: MPRIS audio integration'
    'firefox: Web media playback integration'
    'vlc: Video & media player controls'
    'spectacle: KDE Plasma screenshot trigger'
    'grim: Wayland screenshot tool'
)
provides=('ghostly')
conflicts=('ghostly-git')
source=("\${pkgname}-\${pkgver}.tar.gz::https://github.com/ghostly-linux/\${pkgname}/archive/v\${pkgver}.tar.gz")
sha256sums=('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')

build() {
    cmake -B build -S "\${pkgname}-\${pkgver}" \\
        -DCMAKE_BUILD_TYPE=Release \\
        -DCMAKE_INSTALL_PREFIX=/usr \\
        -DENABLE_WAYLAND=ON \\
        -DENABLE_KDE_PLASMA=ON \\
        -GNinja

    cmake --build build
}

package() {
    DESTDIR="\${pkgdir}" cmake --install build

    # Install desktop entry
    install -Dm644 "\${pkgname}-\${pkgver}/data/ghostly.desktop" \\
        "\${pkgdir}/usr/share/applications/ghostly.desktop"

    # Install application icons
    install -Dm644 "\${pkgname}-\${pkgver}/data/icons/ghostly.svg" \\
        "\${pkgdir}/usr/share/icons/hicolor/scalable/apps/ghostly.svg"

    # Install XDG autostart file
    install -Dm644 "\${pkgname}-\${pkgver}/data/ghostly-autostart.desktop" \\
        "\${pkgdir}/etc/xdg/autostart/ghostly.desktop"
}
`;

export const DESKTOP_FILE_CONTENT = `[Desktop Entry]
Name=Ghostly
GenericName=Dynamic Island Desktop Companion
Comment=Adaptive Dynamic Island desktop companion for Arch Linux and KDE Plasma
Exec=ghostly %u
Icon=ghostly
Terminal=false
Type=Application
Categories=Utility;System;DesktopUtility;KDE;Qt;
Keywords=island;dynamic;companion;widget;eyes;mpris;system;
StartupNotify=true
X-KDE-autostart-phase=2
X-KDE-PluginInfo-Name=ghostly
`;

export const SYSTEMD_SERVICE_CONTENT = `[Unit]
Description=Ghostly Dynamic Island Desktop Companion
PartOf=graphical-session.target
After=plasma-workspace.service

[Service]
Type=simple
ExecStart=/usr/bin/ghostly
Restart=on-failure
RestartSec=3

[Install]
WantedBy=plasma-workspace.target graphical-session.target
`;

export const ARCH_INSTALL_INSTRUCTIONS = `# Installing Ghostly on Arch Linux

# 1. Install prerequisites using pacman:
sudo pacman -S --needed base-devel git cmake ninja qt6-base qt6-declarative qt6-wayland playerctl lm_sensors

# 2. Build and install via PKGBUILD:
git clone https://aur.archlinux.org/ghostly-bin.git /tmp/ghostly
cd /tmp/ghostly
makepkg -si

# 3. Or install via your favorite AUR helper (paru / yay):
yay -S ghostly
# or
paru -S ghostly

# 4. Start Ghostly:
ghostly &

# Enable systemd user service for autostart with KDE Plasma:
systemctl --user enable --now ghostly.service
`;
