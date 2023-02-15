from gali.sources.startable import Startable
from gali.sources.citra.citra_game import CitraGame
from gali.sources.citra.flatpak.citra_flatpak_startup_chain import CitraFlatpakStartupChain


class CitraFlatpakGame(CitraGame, Startable):

    startup_chains = [
        CitraFlatpakStartupChain
    ]