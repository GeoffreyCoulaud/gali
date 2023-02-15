from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.native.yuzu_native_startup_chain import YuzuNativeStartupChain


class YuzuFlatpakStartupChain(YuzuNativeStartupChain):

    game: ABCYuzuGame
    name = "Yuzu Flatpak"
    stem = ["flatpak", "run", "org.yuzu_emu.yuzu"]