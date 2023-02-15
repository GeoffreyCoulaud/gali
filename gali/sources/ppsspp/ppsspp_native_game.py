from gali.sources.abc_startable import ABCStartable
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame
from gali.sources.ppsspp.ppsspp_native_startup_chain import PPSSPPNativeStartupChain


class PPSSPPNativeGame(ABCPPSSPPGame, ABCStartable):

    startup_chains = [
        PPSSPPNativeStartupChain
    ]
