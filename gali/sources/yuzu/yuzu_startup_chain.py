from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.yuzu.yuzu_game import YuzuGame


class YuzuStartupChain(StemmedCLIStartupChain):

    game: YuzuGame

    def get_start_command(self) -> Iterable[str]:
        return [self.game.game_path]