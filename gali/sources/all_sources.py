from gali.sources.citra.citra_source import CitraSource
from gali.sources.citra.citra_flatpak_source import CitraFlatpakSource
from gali.sources.dolphin.dolphin_source import DolphinSource
from gali.sources.dolphin.dolphin_flatpak_source import DolphinFlatpakSource
from gali.sources.ppsspp.ppsspp_source import PPSSPPSource, PPSSPPFlatpakSource
from gali.sources.yuzu.yuzu_source import YuzuFlatpakSource, YuzuSource
from gali.sources.desktop.desktop_source import DesktopSource
from gali.sources.heroic.heroic_source import HeroicSource, HeroicFlatpakSource
from gali.sources.legendary.legendary_source import LegendarySource
from gali.sources.lutris.lutris_source import LutrisSource
from gali.sources.steam.steam_source import SteamSource, SteamFlatpakSource
from gali.sources.retroarch.retroarch_source import RetroarchSource, RetroarchFlatpakSource  # noqa: E501
from gali.sources.cemu.cemu_source import CemuLutrisSource
from gali.sources.itch.itch_source import ItchSource

# Register here all the scannable sources.

all_sources = [
    CemuLutrisSource,
    CitraSource,
    CitraFlatpakSource,
    DesktopSource,
    DolphinSource,
    DolphinFlatpakSource,
    PPSSPPSource,
    PPSSPPFlatpakSource,
    YuzuSource,
    YuzuFlatpakSource,
    HeroicSource,
    HeroicFlatpakSource,
    ItchSource,
    LegendarySource,
    LutrisSource,
    SteamSource,
    SteamFlatpakSource,
    RetroarchSource,
    RetroarchFlatpakSource
]

