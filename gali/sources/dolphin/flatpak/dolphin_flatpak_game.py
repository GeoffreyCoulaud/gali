from gali.sources.startable import Startable
from gali.sources.dolphin.dolphin_game import DolphinGame
from gali.sources.dolphin.flatpak.dolphin_flatpak_startup_chain import DolphinFlatpakStartupChain


class DolphinFlatpakGame(DolphinGame, Startable):

    startup_chains = [
        DolphinFlatpakStartupChain
    ]