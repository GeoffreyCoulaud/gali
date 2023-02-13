from dataclasses import dataclass

from gali.sources.ppsspp.ppsspp_game import PPSSPPGame
from gali.sources.ppsspp.ppsspp_flatpak_startup_chain import PPSSPPFlatpakStartupChain


@dataclass
class PPSSPPFlatpakGame(PPSSPPGame):

    startup_chains = [
        PPSSPPFlatpakStartupChain
    ]