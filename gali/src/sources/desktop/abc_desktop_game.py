from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class ABCDesktopGame(GenericGame):

    platform: str = field(default="PC", init=False)
    is_installed: bool = field(default=True, init=False)
    exec_str: str = field(default=None)