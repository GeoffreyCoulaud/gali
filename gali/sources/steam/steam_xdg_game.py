from gali.sources.startable import Startable
from gali.sources.steam.steam_game import SteamGame
from gali.sources.steam.steam_xdg_startup_chain import SteamXDGStartupChain


class SteamXDGGame(SteamGame, Startable):

    startup_chains = [
        SteamXDGStartupChain
    ]
