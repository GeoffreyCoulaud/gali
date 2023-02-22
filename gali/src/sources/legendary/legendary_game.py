from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class LegendaryGame(GenericGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)