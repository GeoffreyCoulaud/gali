from gali.sources.yuzu.yuzu_source import YuzuSource
from gali.sources.yuzu.native.yuzu_native_game import YuzuNativeGame
from gali.utils.locations import HOME


class YuzuNativeSource(YuzuSource):

    name: str = "Yuzu"
    game_class: type[YuzuNativeGame] = YuzuNativeGame
    config_path: str = f"{HOME}/.config/yuzu/qt-config.ini"