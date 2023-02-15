from gali.sources.startable import Startable
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame
from gali.sources.dolphin.native.dolphin_native_startup_chain import DolphinNativeStartupChain


class DolphinNativeGame(ABCDolphinGame, Startable):

    startup_chains = [
        DolphinNativeStartupChain
    ]
