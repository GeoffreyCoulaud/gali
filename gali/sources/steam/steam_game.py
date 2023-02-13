from dataclasses import dataclass, field

from gali.sources.game import Game
from gali.sources.steam.steam_startup_chain import SteamStartupChain


@dataclass
class SteamGame(Game):

    platform: str = field(default="PC", init=False)
    app_id: str = field(default=None)
    startup_chains = [
        SteamStartupChain
    ]
