from gali.sources.abc_startable import ABCStartable
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame
from gali.sources.dolphin.dolphin_native_startup_chain import DolphinNativeStartupChain


class DolphinNativeGame(ABCDolphinGame, ABCStartable):

    startup_chains = [
        DolphinNativeStartupChain
    ]
