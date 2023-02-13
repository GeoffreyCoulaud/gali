from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain


@dataclass
class PPSSPPGame(EmulationGame):

    platform: str = field(default="Sony - PSP", init=False)
    startup_chains = [
        PPSSPPStartupChain
    ]
