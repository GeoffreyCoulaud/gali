from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame
from gali.sources.citra.citra_startup_chain import CitraStartupChain

@dataclass
class CitraGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - 3DS", init=False)
    startup_chains = [
        CitraStartupChain
    ]