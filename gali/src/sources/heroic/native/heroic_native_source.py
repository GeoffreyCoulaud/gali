from gali.sources.heroic.heroic_source import HeroicSource
from gali.sources.heroic.heroic_xdg_game import HeroicXDGGame
from gali.utils.locations import HOME


class HeroicNativeSource(HeroicSource):

    name: str = "Heroic"
    game_class: type[HeroicXDGGame] = HeroicXDGGame
    config_path: str = f"{HOME}/.config/heroic/lib-cache/library.json"