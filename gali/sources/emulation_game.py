from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame


@dataclass
class EmulationGame(BaseGame):
    """A class representing emulation games"""

    game_path: str = field(default=None)
