from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCCemuGame(EmulationGame):
    """Abstract class representing a Cemu game"""

    platform: str = field(default="Nintendo - Wii U", init=False)