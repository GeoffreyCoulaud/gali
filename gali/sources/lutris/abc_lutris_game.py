from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class ABCLutrisGame(GenericGame):

    platform: str = field(default="PC", init=False)
    game_slug: str = field(default=None)
    config_path: str = field(default=None)