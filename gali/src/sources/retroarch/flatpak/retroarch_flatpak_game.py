from gali.sources.startable import Startable
from gali.sources.retroarch.retroarch_game import RetroarchGame
from gali.sources.retroarch.flatpak.retroarch_flatpak_startup_chain import RetroarchFlatpakStartupChain

class RetroarchFlatpakGame(RetroarchGame, Startable):

    startup_chains = [
        RetroarchFlatpakStartupChain
    ]