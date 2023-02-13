from typing import Iterable

from gali.sources.citra.citra_startup_chain import CitraStartupChain


class CitraFlatpakStartupChain(CitraStartupChain):

    stem = ["flatpak", "run", "org.citra_emu.citra"]

    def get_start_command_suffix(self, game, **kwargs) -> Iterable[str]:
        return [game.game_path]