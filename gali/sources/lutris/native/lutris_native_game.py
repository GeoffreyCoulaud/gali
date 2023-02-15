from gali.sources.startable import Startable
from gali.sources.lutris.lutris_game import LutrisGame
from gali.sources.lutris.native.lutris_native_startup_chain import LutrisNativeStartupChain


class LutrisNativeGame(LutrisGame, Startable):

    startup_chains = [
        LutrisNativeStartupChain
    ]
