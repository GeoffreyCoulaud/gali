from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCCemuGame(ABCEmulationGame):
    """Abstract class representing a Cemu game"""

    platform: str = field(default="Nintendo - Wii U", init=False)