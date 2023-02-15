from gali.sources.abc_startable import ABCStartable
from gali.sources.steam.abc_steam_game import ABCSteamGame
from gali.sources.steam.steam_startup_chain import SteamStartupChain


class SteamGame(ABCSteamGame, ABCStartable):

    startup_chains = [
        SteamStartupChain
    ]
