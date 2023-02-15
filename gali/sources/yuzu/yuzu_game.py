from gali.sources.abc_startable import ABCStartable
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain


class YuzuGame(ABCYuzuGame, ABCStartable):

    startup_chains = [
        YuzuStartupChain
    ]
