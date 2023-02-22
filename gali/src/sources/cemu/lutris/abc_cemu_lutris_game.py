from dataclasses import dataclass, field

from gali.sources.cemu.cemu_game import CemuGame


@dataclass
class ABCCemuLutrisGame(CemuGame):
    """Class representing a Cemu in Lutris game"""

    wine_prefix_path: str = field(default="")
    cemu_slug: str = field(default="cemu")
