from gali.sources.abc_startable import ABCStartable
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.retroarch_flatpak_startup_chain import RetroarchFlatpakStartupChain

class RetroarchFlatpakGame(ABCRetroarchGame, ABCStartable):

    startup_chains = [
        RetroarchFlatpakStartupChain
    ]