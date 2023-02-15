from gali.sources.cemu.lutris.cemu_lutris_source import CemuLutrisSource
from gali.sources.citra.native.citra_native_source import CitraNativeSource
from gali.sources.citra.flatpak.citra_flatpak_source import CitraFlatpakSource
from gali.sources.desktop.desktop_source import DesktopSource
from gali.sources.dolphin.native.dolphin_native_source import DolphinNativeSource
from gali.sources.dolphin.flatpak.dolphin_flatpak_source import DolphinFlatpakSource
from gali.sources.heroic.heroic_source import HeroicSource
from gali.sources.heroic.heroic_flatpak_source import HeroicFlatpakSource
from gali.sources.itch.native.itch_native_source import ItchNativeSource
from gali.sources.legendary.native.legendary_native_source import LegendaryNativeSource
from gali.sources.lutris.native.lutris_native_source import LutrisNativeSource
from gali.sources.ppsspp.native.ppsspp_native_source import PPSSPPNativeSource
from gali.sources.ppsspp.flatpak.ppsspp_flatpak_source import PPSSPPFlatpakSource
from gali.sources.retroarch.native.retroarch_native_source import RetroarchNativeSource
from gali.sources.retroarch.flatpak.retroarch_flatpak_source import RetroarchFlatpakSource
from gali.sources.steam.steam_source import SteamSource 
from gali.sources.steam.steam_flatpak_source import SteamFlatpakSource
from gali.sources.yuzu.native.yuzu_native_source import YuzuNativeSource
from gali.sources.yuzu.flatpak.yuzu_flatpak_source import YuzuFlatpakSource

# Register here all the scannable sources.

all_sources = [
    CemuLutrisSource,
    CitraNativeSource,
    CitraFlatpakSource,
    DesktopSource,
    DolphinNativeSource,
    DolphinFlatpakSource,
    HeroicSource,
    HeroicFlatpakSource,
    ItchNativeSource,
    LegendaryNativeSource,
    LutrisNativeSource,
    PPSSPPNativeSource,
    PPSSPPFlatpakSource,
    RetroarchNativeSource,
    RetroarchFlatpakSource,
    SteamSource,
    SteamFlatpakSource,
    YuzuNativeSource,
    YuzuFlatpakSource
]

