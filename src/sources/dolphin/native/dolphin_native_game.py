from gali.sources.startable import Startable
from gali.sources.dolphin.dolphin_game import DolphinGame
from gali.sources.dolphin.native.dolphin_native_startup_chain import DolphinNativeStartupChain


class DolphinNativeGame(DolphinGame, Startable):

    startup_chains = [
        DolphinNativeStartupChain
    ]
