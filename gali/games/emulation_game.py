from dataclasses import dataclass, field

from gali.games.game import Game


@dataclass
class EmulationGame(Game):
    """A class representing emulation games"""

    game_path: str = field(default=None)
