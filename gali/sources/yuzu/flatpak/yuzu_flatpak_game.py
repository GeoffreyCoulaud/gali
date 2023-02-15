from gali.sources.startable import Startable
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.flatpak.yuzu_flatpak_startup_chain import YuzuFlatpakStartupChain


class YuzuFlatpakGame(ABCYuzuGame, Startable):

    startup_chains = [
        YuzuFlatpakStartupChain
    ]