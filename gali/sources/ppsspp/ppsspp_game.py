from gali.sources.abc_startable import ABCStartable
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame
from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain


class PPSSPPGame(ABCPPSSPPGame, ABCStartable):

    startup_chains = [
        PPSSPPStartupChain
    ]
