from gali.sources.startable import Startable
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.flatpak.retroarch_flatpak_startup_chain import RetroarchFlatpakStartupChain

class RetroarchFlatpakGame(ABCRetroarchGame, Startable):

    startup_chains = [
        RetroarchFlatpakStartupChain
    ]