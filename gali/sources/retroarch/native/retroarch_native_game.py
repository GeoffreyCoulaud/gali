from gali.sources.startable import Startable
from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.native.retroarch_native_startup_chain import RetroarchNativeStartupChain


class RetroarchNativeGame(ABCRetroarchGame, Startable):

    startup_chains = [
        RetroarchNativeStartupChain
    ]