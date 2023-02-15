from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame


@dataclass
class ABCSteamGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)
