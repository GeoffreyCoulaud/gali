from gali.utils.sandbox import is_flatpak
from gali.sources.citra_source import CitraSource, CitraFlatpakSource
from gali.sources.dolphin_source import DolphinSource, DolphinFlatpakSource
from gali.sources.ppsspp_source import PPSSPPSource, PPSSPPFlatpakSource
from gali.sources.yuzu_source import YuzuFlatpakSource, YuzuSource
from gali.sources.desktop_source import DesktopSource
from gali.sources.heroic_source import HeroicSource, HeroicFlatpakSource
from gali.sources.legendary_source import LegendarySource
from gali.sources.lutris_source import LutrisSource
from gali.sources.steam_source import SteamSource, SteamFlatpakSource
from gali.sources.retroarch_source import RetroarchSource, RetroarchFlatpakSource  # noqa: E501
from gali.sources.cemu_source import CemuLutrisSource
from gali.sources.itch_source import ItchSource

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

