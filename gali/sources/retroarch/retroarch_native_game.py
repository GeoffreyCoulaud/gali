from gali.sources.abc_startable import ABCStartable
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.retroarch_native_startup_chain import RetroarchNativeStartupChain


class RetroarchNativeGame(ABCRetroarchGame, ABCStartable):

    startup_chains = [
        RetroarchNativeStartupChain
    ]