from gali.sources.heroic.heroic_source import HeroicSource
from gali.sources.heroic.heroic_game import HeroicGame
from gali.utils.locations import HOME


class HeroicFlatpakSource(HeroicSource):

    name: str = "Heroic (Flatpak)"
    game_class: type[HeroicGame] = HeroicGame
    config_path: str = f"{HOME}/.var/app/com.heroicgameslauncher.hgl/config/heroic/lib-cache/library.json"