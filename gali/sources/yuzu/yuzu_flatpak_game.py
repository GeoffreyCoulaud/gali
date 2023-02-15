from gali.sources.abc_startable import ABCStartable
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.yuzu_flatpak_startup_chain import YuzuFlatpakStartupChain


class YuzuFlatpakGame(ABCYuzuGame, ABCStartable):

    startup_chains = [
        YuzuFlatpakStartupChain
    ]