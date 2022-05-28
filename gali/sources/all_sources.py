from gali.sources.citra_source import CitraSource, CitraFlatpakSource
from gali.sources.dolphin_source import DolphinSource, DolphinFlatpakSource

# Register here all the scannable sources.
all_sources = (
	CitraSource,
	CitraFlatpakSource,
	DolphinSource,
	DolphinFlatpakSource,
)