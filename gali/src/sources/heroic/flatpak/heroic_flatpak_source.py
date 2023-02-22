from gali.sources.heroic.heroic_source import HeroicSource
from gali.sources.heroic.heroic_xdg_game import HeroicXDGGame
from gali.utils.locations import HOME


class HeroicFlatpakSource(HeroicSource):

    name: str = "Heroic (Flatpak)"
    game_class: type[HeroicXDGGame] = HeroicXDGGame
    config_path: str = f"{HOME}/.var/app/com.heroicgameslauncher.hgl/config/heroic/lib-cache/library.json"