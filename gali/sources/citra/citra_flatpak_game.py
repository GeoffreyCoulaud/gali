from dataclasses import dataclass

from gali.sources.citra.citra_flatpak_startup_chain import CitraFlatpakStartupChain
from gali.sources.citra.citra_game import CitraGame


@dataclass
class CitraFlatpakGame(CitraGame):

    startup_chains = [
        CitraFlatpakStartupChain
    ]