from gali.sources.script_startup_chain import ScriptStartupChain
from gali.sources.lutris.lutris_game import LutrisGame
from gali.utils.lutris_export_script import lutris_export_script

class LutrisNativeStartupChain(ScriptStartupChain):

    game: LutrisGame
    name = "Lutris"

    def make_script(self) -> None:
        """Export the lutris start script to a temp file"""
        lutris_export_script(self.game.game_slug, self.tempfile)