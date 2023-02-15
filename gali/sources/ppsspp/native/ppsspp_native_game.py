from gali.sources.startable import Startable
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame
from gali.sources.ppsspp.native.ppsspp_native_startup_chain import PPSSPPNativeStartupChain


class PPSSPPNativeGame(ABCPPSSPPGame, Startable):

    startup_chains = [
        PPSSPPNativeStartupChain
    ]
