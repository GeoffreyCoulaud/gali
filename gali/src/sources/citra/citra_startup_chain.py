from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.citra.citra_game import CitraGame


class CitraStartupChain(StemmedCLIStartupChain):

    game: CitraGame

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]