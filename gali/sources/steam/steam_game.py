from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame
from gali.sources.steam.steam_startup_chain import SteamStartupChain


@dataclass
class SteamGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)
    startup_chains = [
        SteamStartupChain
    ]
