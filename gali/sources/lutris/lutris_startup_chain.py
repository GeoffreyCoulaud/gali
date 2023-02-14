from gali.sources.shell_script_startup_chain import ShellScriptStartupChain
from gali.utils.lutris_export_script import lutris_export_script

class LutrisStartupChain(ShellScriptStartupChain):

    name = "Lutris"
    _tempfile: str

    def make_script(self) -> None:
        """Export the lutris start script to a temp file"""
        lutris_export_script(self.game.game_slug, self._tempfile)