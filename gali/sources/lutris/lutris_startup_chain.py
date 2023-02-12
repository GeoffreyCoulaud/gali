from typing import Iterable
from tempfile import mkstemp
from os import remove

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain
from gali.utils.lutris_export_script import lutris_export_script
from gali.utils.prepare_filename import prepare_filename

class LutrisStartupChain(ShellCommandStartupChain):

    name = "Lutris"
    _tempfile: str

    def prepare(self, game, **kwargs) -> None:
        """Export the lutris start script to a temp file
        * Can raise an exception if the export is not successful"""
        suffix = f"-lutris-{prepare_filename(game.game_slug)}.sh"
        (_, path) = mkstemp(suffix=suffix)
        lutris_export_script(game.game_slug, path)
        self._tempfile = path

    def get_start_command(self, **kwargs) -> None:
        """Run the exported script in the user's defined shell"""
        return ("sh", self._tempfile)

    def cleanup(self, **kwargs) -> None:
        """Delete the temp file"""
        try:
            remove(self._tempfile)
        except FileNotFoundError:
            # If the file doesn't exist, nothing to do.
            pass