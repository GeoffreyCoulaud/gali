from gali.sources.abc_startable import ABCStartable
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.native.yuzu_native_startup_chain import YuzuNativeStartupChain


class YuzuNativeGame(ABCYuzuGame, ABCStartable):

    startup_chains = [
        YuzuNativeStartupChain
    ]
