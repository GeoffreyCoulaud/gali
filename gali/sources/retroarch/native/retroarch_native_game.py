from gali.sources.startable import Startable
from gali.sources.retroarch.retroarch_game import RetroarchGame
from gali.sources.retroarch.native.retroarch_native_startup_chain import RetroarchNativeStartupChain


class RetroarchNativeGame(RetroarchGame, Startable):

    startup_chains = [
        RetroarchNativeStartupChain
    ]