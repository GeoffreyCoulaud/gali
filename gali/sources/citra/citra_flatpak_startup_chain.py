from typing import Iterable

from gali.sources.citra.citra_native_startup_chain import CitraNativeStartupChain


class CitraFlatpakStartupChain(CitraNativeStartupChain):

    name = "Citra Flatpak"
    stem = ["flatpak", "run", "org.citra_emu.citra"]

    def get_start_command_suffix(self) -> Iterable[str]:
        return [self.game.game_path]