from gali.sources.yuzu.yuzu_flatpak_game import YuzuFlatpakGame
from gali.sources.yuzu.yuzu_source import YuzuSource
from gali.utils.locations import HOME


class YuzuFlatpakSource(YuzuSource):

    name: str = "Yuzu (Flatpak)"
    game_class: type[YuzuFlatpakGame] = YuzuFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.yuzu_emu.yuzu/config/yuzu/qt-config.ini"