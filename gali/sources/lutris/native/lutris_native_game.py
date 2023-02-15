from gali.sources.startable import Startable
from gali.sources.lutris.abc_lutris_game import ABCLutrisGame
from gali.sources.lutris.native.lutris_native_startup_chain import LutrisNativeStartupChain


class LutrisNativeGame(ABCLutrisGame, Startable):

    startup_chains = [
        LutrisNativeStartupChain
    ]
