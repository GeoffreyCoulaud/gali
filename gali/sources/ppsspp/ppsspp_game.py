from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame
from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain


@dataclass
class PPSSPPGame(ABCEmulationGame):

    platform: str = field(default="Sony - PSP", init=False)
    startup_chains = [
        PPSSPPStartupChain
    ]
