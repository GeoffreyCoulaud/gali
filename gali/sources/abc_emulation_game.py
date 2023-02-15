from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame


@dataclass
class ABCEmulationGame(ABCGenericGame):
    """A class representing emulation games"""

    game_path: str = field(default="")
