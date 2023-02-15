from gali.sources.abc_startable import ABCStartable
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame
from gali.sources.dolphin.dolphin_flatpak_startup_chain import DolphinFlatpakStartupChain


class DolphinFlatpakGame(ABCDolphinGame, ABCStartable):

    startup_chains = [
        DolphinFlatpakStartupChain
    ]