from dataclasses import dataclass
from gali.sources.startable import Startable

from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame
from gali.sources.ppsspp.flatpak.ppsspp_flatpak_startup_chain import PPSSPPFlatpakStartupChain


@dataclass
class PPSSPPFlatpakGame(ABCPPSSPPGame, Startable):

    startup_chains = [
        PPSSPPFlatpakStartupChain
    ]