from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class EmulationGame(GenericGame):
    """A class representing emulation games"""

    game_path: str = field(default="")
