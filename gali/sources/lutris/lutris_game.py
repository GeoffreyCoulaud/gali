from gali.sources.abc_startable import ABCStartable
from gali.sources.lutris.abc_lutris_game import ABCLutrisGame
from gali.sources.lutris.lutris_startup_chain import LutrisStartupChain


class LutrisGame(ABCLutrisGame, ABCStartable):

    startup_chains = [
        LutrisStartupChain
    ]
