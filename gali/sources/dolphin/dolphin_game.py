from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain


@dataclass
class DolphinGame(EmulationGame):

    platform: str = field(default="Nintendo - Gamecube / Wii", init=False)
    startup_chains = [
        DolphinStartupChain
    ]
