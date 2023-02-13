from tempfile import mkstemp
from os import remove

from gali.sources.shell_script_startup_chain import ShellScriptStartupChain
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.prepare_filename import prepare_filename

class LutrisStartupChain(ShellScriptStartupChain):

    name = "Lutris"
    _tempfile: str

    def make_script(self, game, **kwargs) -> None:
        """Export the lutris start script to a temp file"""
        lutris_export_script(game.game_slug, self._tempfile)