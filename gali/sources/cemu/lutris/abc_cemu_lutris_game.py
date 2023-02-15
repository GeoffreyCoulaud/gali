from dataclasses import dataclass, field

from gali.sources.cemu.abc_cemu_game import ABCCemuGame


@dataclass
class ABCCemuLutrisGame(ABCCemuGame):
    """Class representing a Cemu in Lutris game"""

    wine_prefix_path: str = field(default="")
    cemu_slug: str = field(default="cemu")
