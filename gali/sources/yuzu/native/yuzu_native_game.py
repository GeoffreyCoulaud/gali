from gali.sources.startable import Startable
from gali.sources.yuzu.yuzu_game import YuzuGame
from gali.sources.yuzu.native.yuzu_native_startup_chain import YuzuNativeStartupChain


class YuzuNativeGame(YuzuGame, Startable):

    startup_chains = [
        YuzuNativeStartupChain
    ]
