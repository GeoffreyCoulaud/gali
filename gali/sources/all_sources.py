from gali.sources.citra_source import CitraSource, CitraFlatpakSource
from gali.sources.dolphin_source import DolphinSource, DolphinFlatpakSource
from gali.sources.ppsspp_source import PPSSPPSource, PPSSPPFlatpakSource
from gali.sources.yuzu_source import YuzuFlatpakSource, YuzuSource
from gali.sources.desktop_source import DesktopSource

# Register here all the scannable sources.
all_sources = (
	CitraSource,
	CitraFlatpakSource,
	DolphinSource,
	DolphinFlatpakSource,
	PPSSPPSource,
	PPSSPPFlatpakSource,
	YuzuSource,
	YuzuFlatpakSource,
	DesktopSource,
)