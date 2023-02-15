from dataclasses import dataclass
from gali.sources.abc_startable import ABCStartable

from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame
from gali.sources.ppsspp.ppsspp_flatpak_startup_chain import PPSSPPFlatpakStartupChain


@dataclass
class PPSSPPFlatpakGame(ABCPPSSPPGame, ABCStartable):

    startup_chains = [
        PPSSPPFlatpakStartupChain
    ]