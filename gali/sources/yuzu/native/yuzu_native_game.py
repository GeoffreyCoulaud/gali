from gali.sources.startable import Startable
from gali.sources.yuzu.abc_yuzu_game import ABCYuzuGame
from gali.sources.yuzu.native.yuzu_native_startup_chain import YuzuNativeStartupChain


class YuzuNativeGame(ABCYuzuGame, Startable):

    startup_chains = [
        YuzuNativeStartupChain
    ]
