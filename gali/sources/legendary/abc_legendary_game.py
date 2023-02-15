from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame


@dataclass
class ABCLegendaryGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)