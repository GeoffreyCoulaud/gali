from gali.sources.startable import Startable
from gali.sources.ppsspp.ppsspp_game import PPSSPPGame
from gali.sources.ppsspp.native.ppsspp_native_startup_chain import PPSSPPNativeStartupChain


class PPSSPPNativeGame(PPSSPPGame, Startable):

    startup_chains = [
        PPSSPPNativeStartupChain
    ]
