from dataclasses import dataclass
from gali.sources.startable import Startable

from gali.sources.ppsspp.ppsspp_game import PPSSPPGame
from gali.sources.ppsspp.flatpak.ppsspp_flatpak_startup_chain import PPSSPPFlatpakStartupChain


@dataclass
class PPSSPPFlatpakGame(PPSSPPGame, Startable):

    startup_chains = [
        PPSSPPFlatpakStartupChain
    ]