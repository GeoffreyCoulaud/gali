from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain


class YuzuFlatpakStartupChain(YuzuStartupChain):

    game: ABCYuzuGame
    name = "Yuzu Flatpak"
    stem = ["flatpak", "run", "org.yuzu_emu.yuzu"]