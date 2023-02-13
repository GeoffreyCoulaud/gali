from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.citra.citra_startup_chain import CitraStartupChain

@dataclass
class CitraGame(EmulationGame):

    platform: str = field(default="Nintendo - 3DS", init=False)
    startup_chains = [
        CitraStartupChain
    ]