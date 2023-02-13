from dataclasses import dataclass

from gali.sources.yuzu.yuzu_game import YuzuGame
from gali.sources.yuzu.yuzu_flatpak_startup_chain import YuzuFlatpakStartupChain


@dataclass
class YuzuFlatpakGame(YuzuGame):

    startup_chains = [
        YuzuFlatpakStartupChain
    ]