from gali.sources.dolphin.dolphin_game import DolphinGame
from gali.sources.dolphin.dolphin_flatpak_startup_chain import DolphinFlatpakStartupChain


class DolphinFlatpakGame(DolphinGame):

    startup_chains = [
        DolphinFlatpakStartupChain
    ]