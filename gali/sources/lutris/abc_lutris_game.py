from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame


@dataclass
class ABCLutrisGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    game_slug: str = field(default=None)
    config_path: str = field(default=None)