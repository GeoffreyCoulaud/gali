from gali.sources.abc_startable import ABCStartable
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


class RetroarchGame(ABCRetroarchGame, ABCStartable):

    startup_chains = [
        RetroarchStartupChain
    ]