from gali.sources.startable import Startable
from gali.sources.yuzu.yuzu_game import YuzuGame
from gali.sources.yuzu.flatpak.yuzu_flatpak_startup_chain import YuzuFlatpakStartupChain


class YuzuFlatpakGame(YuzuGame, Startable):

    startup_chains = [
        YuzuFlatpakStartupChain
    ]