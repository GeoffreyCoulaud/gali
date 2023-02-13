from gali.sources.cemu.cemu_source import CemuLutrisSource
from gali.sources.citra.citra_source import CitraSource
from gali.sources.citra.citra_flatpak_source import CitraFlatpakSource
from gali.sources.desktop.desktop_source import DesktopSource
from gali.sources.dolphin.dolphin_source import DolphinSource
from gali.sources.dolphin.dolphin_flatpak_source import DolphinFlatpakSource
from gali.sources.heroic.heroic_source import HeroicSource
from gali.sources.heroic.heroic_flatpak_source import HeroicFlatpakSource
from gali.sources.itch.itch_source import ItchSource
from gali.sources.legendary.legendary_source import LegendarySource
from gali.sources.lutris.lutris_source import LutrisSource
from gali.sources.ppsspp.ppsspp_source import PPSSPPSource
from gali.sources.ppsspp.ppsspp_flatpak_source import PPSSPPFlatpakSource
from gali.sources.retroarch.retroarch_source import RetroarchSource
from gali.sources.retroarch.retroarch_flatpak_source import RetroarchFlatpakSource
from gali.sources.steam.steam_source import SteamSource 
from gali.sources.steam.steam_flatpak_source import SteamFlatpakSource
from gali.sources.yuzu.yuzu_source import YuzuSource
from gali.sources.yuzu.yuzu_flatpak_source import YuzuFlatpakSource

# Register here all the scannable sources.

all_sources = [
    CemuLutrisSource,
    CitraSource,
    CitraFlatpakSource,
    DesktopSource,
    DolphinSource,
    DolphinFlatpakSource,
    HeroicSource,
    HeroicFlatpakSource,
    ItchSource,
    LegendarySource,
    LutrisSource,
    PPSSPPSource,
    PPSSPPFlatpakSource,
    RetroarchSource,
    RetroarchFlatpakSource,
    SteamSource,
    SteamFlatpakSource,
    YuzuSource,
    YuzuFlatpakSource
]

