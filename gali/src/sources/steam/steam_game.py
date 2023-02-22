from dataclasses import dataclass, field

from gali.sources.generic_game import GenericGame


@dataclass
class SteamGame(GenericGame):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)
