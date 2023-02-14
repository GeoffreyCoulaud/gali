from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.cemu.cemu_lutris_startup_chain import CemuLutrisStartupChain


@dataclass
class CemuGame(EmulationGame):
    """Abstract class representing a Cemu game"""

    platform: str = field(default="Nintendo - Wii U", init=False)


@dataclass
class CemuLutrisGame(CemuGame):
    """Class representing a Cemu in Lutris game"""

    wine_prefix_path: str = field(default="")
    cemu_slug: str = field(default="cemu")
    startup_chains = [
        CemuLutrisStartupChain
    ]
