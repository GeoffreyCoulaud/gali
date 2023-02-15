from typing import Iterable

from gali.sources.stemmed_cli_startup_chain import StemmedCLIStartupChain
from gali.sources.heroic.abc_heroic_game import ABCHeroicGame


class HeroicStartupChain(StemmedCLIStartupChain):

    game: ABCHeroicGame
    name = "Heroic"
    stem = ["xdg-open"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [f"heroic://launch/{self.game.app_name}"]