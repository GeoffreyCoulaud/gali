from gali.sources.startable import Startable
from gali.sources.steam.abc_steam_game import ABCSteamGame
from gali.sources.steam.steam_startup_chain import SteamStartupChain


class SteamGame(ABCSteamGame, Startable):

    startup_chains = [
        SteamStartupChain
    ]
