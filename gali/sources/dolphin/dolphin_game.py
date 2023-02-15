from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame
from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain


@dataclass
class DolphinGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - Gamecube / Wii", init=False)
    startup_chains = [
        DolphinStartupChain
    ]
