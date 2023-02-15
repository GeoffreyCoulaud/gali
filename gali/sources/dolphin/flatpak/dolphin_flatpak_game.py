from gali.sources.startable import Startable
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame
from gali.sources.dolphin.flatpak.dolphin_flatpak_startup_chain import DolphinFlatpakStartupChain


class DolphinFlatpakGame(ABCDolphinGame, Startable):

    startup_chains = [
        DolphinFlatpakStartupChain
    ]