from gali.sources.abc_startable import ABCStartable
from gali.sources.lutris.abc_lutris_game import ABCLutrisGame
from gali.sources.lutris.native.lutris_native_startup_chain import LutrisNativeStartupChain


class LutrisNativeGame(ABCLutrisGame, ABCStartable):

    startup_chains = [
        LutrisNativeStartupChain
    ]
