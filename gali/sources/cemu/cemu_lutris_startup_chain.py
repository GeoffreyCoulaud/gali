from gali.sources.abc_script_startup_chain import ABCScriptStartupChain
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.wine_path import posix_to_wine


class CemuLutrisStartupChain(ABCScriptStartupChain):

    name: str = "Cemu in Lutris"
    _tempfile: str

    def make_script(self) -> None:
        # TODO export lutris script first
        
        # Get cemu args
        game_path_wine = posix_to_wine(self.game.game_path)
        args = ("--game", game_path_wine)

        # Get script contents, with trailing whitespace removed
        file_contents = ""
        with open(self._tempfile, "r", encoding="utf-8-sig") as file:
            file_contents = file.read().rstrip()

        # Add cemu arguments to script
        to_append = " " + " ".join(args)
        file_contents += to_append
        with open(self._tempfile, "w", encoding="utf-8-sig") as file:
            file.write(file_contents)