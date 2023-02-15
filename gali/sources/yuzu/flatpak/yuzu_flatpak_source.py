from gali.sources.yuzu.flatpak.yuzu_flatpak_game import YuzuFlatpakGame
from gali.sources.yuzu.native.yuzu_native_source import YuzuNativeSource
from gali.utils.locations import HOME


class YuzuFlatpakSource(YuzuNativeSource):

    name: str = "Yuzu (Flatpak)"
    game_class: type[YuzuFlatpakGame] = YuzuFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.yuzu_emu.yuzu/config/yuzu/qt-config.ini"