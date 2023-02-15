from gali.sources.heroic.heroic_source import HeroicSource
from gali.utils.locations import HOME


class HeroicNativeSource(HeroicSource):

    name: str = "Heroic"
    config_path: str = f"{HOME}/.config/heroic/lib-cache/library.json"