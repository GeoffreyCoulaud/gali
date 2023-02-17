from shlex import quote

from gali.sources.cemu.lutris.abc_cemu_lutris_game import ABCCemuLutrisGame
from gali.sources.script_startup_chain import ScriptStartupChain
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.wine_path import posix_to_wine

class CemuLutrisStartupChain(ScriptStartupChain):

    name: str = "Cemu in Lutris"
    game: ABCCemuLutrisGame

    def make_script(self) -> None:

        # Export base Lutris script that starts Cemu
        lutris_export_script("cemu", self.tempfile)

        # Get game args passed to Cemu
        game_path_wine = posix_to_wine(self.game.game_path)
        args = ["--game", quote(game_path_wine)]

        # ? On large scripts this may hang, however I think Lutris scripts are not that big.
        # Get script contents, with trailing whitespace removed
        file_contents = ""
        with open(self.tempfile, "r", encoding="utf-8-sig") as file:
            file_contents = file.read().rstrip()

        # Add cemu arguments to script
        to_append = " " + " ".join(args)
        file_contents += to_append
        with open(self.tempfile, "w", encoding="utf-8-sig") as file:
            file.write(file_contents)