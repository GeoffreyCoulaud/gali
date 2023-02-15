from gali.sources.abc_script_startup_chain import ABCScriptStartupChain
from gali.sources.lutris.abc_lutris_game import ABCLutrisGame
from gali.utils.lutris_export_script import lutris_export_script

class LutrisNativeStartupChain(ABCScriptStartupChain):

    game: ABCLutrisGame
    name = "Lutris"
    _tempfile: str

    def make_script(self) -> None:
        """Export the lutris start script to a temp file"""
        lutris_export_script(self.game.game_slug, self._tempfile)