from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame
from gali.sources.steam.steam_startup_chain import SteamStartupChain


@dataclass
class SteamGame(BaseGame):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)
    startup_chains = [
        SteamStartupChain
    ]
