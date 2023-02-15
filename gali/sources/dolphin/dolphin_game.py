from gali.sources.abc_startable import ABCStartable
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame
from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain


class DolphinGame(ABCDolphinGame, ABCStartable):

    startup_chains = [
        DolphinStartupChain
    ]
